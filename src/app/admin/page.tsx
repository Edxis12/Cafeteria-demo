"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";
import { playNotificationSound } from "@/src/lib/audio";
import { AdminHeader } from "@/src/components/admin/AdminHeader";
import { AdminStats } from "@/src/components/admin/AdminStats";
import {
  ReservationsTab,
  Reservation,
} from "@/src/components/admin/ReservationTab";
import { MenuTab, MenuItem } from "@/src/components/admin/MenuTab";
import { ReviewsTab, AdminReview } from "@/src/components/admin/ReviewsTab";
import { EditMenuModal } from "@/src/components/admin/EditMenuModal";
import { useDebounce } from "@/src/hooks/useDebounce";
import { RefreshCw, Utensils, Coffee, Star, Download } from "lucide-react";

interface DashboardStats {
  total: number;
  pending: number;
  confirmedGuests: number;
  seasonalCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "reservations" | "menu" | "reviews"
  >("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newArrivalAlert, setNewArrivalAlert] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    confirmedGuests: 0,
    seasonalCount: 0,
  });

  const router = useRouter();
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const notificationsRef = useRef(notificationsEnabled);

  useEffect(() => {
    notificationsRef.current = notificationsEnabled;
  }, [notificationsEnabled]);

  const toggleBrowserNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    playNotificationSound();
    if ("Notification" in window && Notification.permission !== "granted") {
      try {
        await Notification.requestPermission();
      } catch (err: unknown) {
        console.log("Error solicitando permisos:", err);
      }
    }
    setNotificationsEnabled(true);
  };

  // 1. Funciones de obtención de datos declaradas antes de los efectos
  const fetchReservations = useCallback(async () => {
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setReservations(data || []);
  }, []);

  const fetchStatsCounts = useCallback(async () => {
    const [
      { count: totalCount },
      { count: pendingCount },
      { data: confirmedData },
      { count: seasonalCount },
    ] = await Promise.all([
      supabase.from("reservations").select("*", { count: "exact", head: true }),
      supabase
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase.from("reservations").select("guests").neq("status", "cancelled"),
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("is_seasonal", true),
    ]);

    const totalGuests = (confirmedData || []).reduce(
      (acc, curr) => acc + (Number(curr.guests) || 0),
      0,
    );

    setStats({
      total: totalCount || 0,
      pending: pendingCount || 0,
      confirmedGuests: totalGuests,
      seasonalCount: seasonalCount || 0,
    });
  }, []);

  const fetchMenuItems = useCallback(async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("created_at", { ascending: false });
    setMenuItems(data || []);
  }, []);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setReviews(data || []);
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchReservations(),
      fetchMenuItems(),
      fetchReviews(),
      fetchStatsCounts(),
    ]);
    setLoading(false);
  }, [fetchReservations, fetchMenuItems, fetchReviews, fetchStatsCounts]);

  // 2. Efecto de autenticación y suscripción en tiempo real
  useEffect(() => {
    let adminChannel: RealtimeChannel | null = null;

    const verifyAndSubscribe = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.replace("/admin/login");
        return;
      }

      setAuthenticated(true);
      fetchAllData();

      if (adminChannel) {
        await supabase.removeChannel(adminChannel);
      }

      const channelId = Date.now();

      adminChannel = supabase
        .channel(`realtime_admin_${channelId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reservations" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newRes = payload.new as Reservation;
              if (notificationsRef.current) {
                playNotificationSound();
                if (
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification(`☕ Nueva Reserva: ${newRes.name}`, {
                    body: `${newRes.guests} personas • ${newRes.reservation_date} a las ${newRes.reservation_time}`,
                    icon: "/favicon.ico",
                  });
                }
              }
              setNewArrivalAlert(
                `Nueva reserva de ${newRes.name} (${newRes.guests} personas)`,
              );
              setReservations((prev) => {
                if (prev.some((r) => r.id === newRes.id)) return prev;
                return [newRes, ...prev].slice(0, 50);
              });
              fetchStatsCounts();
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as Reservation;
              setReservations((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r)),
              );
              fetchStatsCounts();
            } else if (payload.eventType === "DELETE") {
              setReservations((prev) =>
                prev.filter((r) => r.id !== (payload.old as { id: string }).id),
              );
              fetchStatsCounts();
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "menu_items" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newItem = payload.new as MenuItem;
              setMenuItems((prev) => {
                if (prev.some((m) => m.id === newItem.id)) return prev;
                return [newItem, ...prev];
              });
              fetchStatsCounts();
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as MenuItem;
              setMenuItems((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m)),
              );
              fetchStatsCounts();
            } else if (payload.eventType === "DELETE") {
              setMenuItems((prev) =>
                prev.filter((m) => m.id !== (payload.old as { id: string }).id),
              );
              fetchStatsCounts();
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "reviews" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newRev = payload.new as AdminReview;
              if (notificationsRef.current) {
                playNotificationSound();
                if (
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification(`⭐ Nueva Reseña: ${newRev.name}`, {
                    body: `${newRev.stars}★: "${(newRev.comment || "").slice(0, 70)}..."`,
                    icon: "/favicon.ico",
                  });
                }
              }
              setNewArrivalAlert(
                `Nueva reseña de ${newRev.name} (${newRev.stars}★)`,
              );
              setReviews((prev) => {
                if (prev.some((r) => r.id === newRev.id)) return prev;
                return [newRev, ...prev];
              });
            } else if (payload.eventType === "UPDATE") {
              const updated = payload.new as AdminReview;
              setReviews((prev) =>
                prev.map((r) => (r.id === updated.id ? updated : r)),
              );
            } else if (payload.eventType === "DELETE") {
              setReviews((prev) =>
                prev.filter((r) => r.id !== (payload.old as { id: string }).id),
              );
            }
          },
        )
        .subscribe();
    };

    verifyAndSubscribe();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) verifyAndSubscribe();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      if (adminChannel) supabase.removeChannel(adminChannel);
    };
  }, [fetchAllData, fetchStatsCounts]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
      );
      fetchStatsCounts();
    }
  };

  const handleApproveReview = async (id: string) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: true })
      .eq("id", id);
    if (!error) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: true } : r)),
      );
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta reseña?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleAddProduct = async (productData: Partial<MenuItem>) => {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([productData])
      .select()
      .single();

    if (!error && data) {
      setMenuItems((prev) => [
        data as MenuItem,
        ...prev.filter((m) => m.id !== data.id),
      ]);
      fetchStatsCounts();
      return true;
    }
    alert("Error al agregar el producto");
    return false;
  };

  const handleUpdateProduct = async (updatedData: Partial<MenuItem>) => {
    if (!editingItem) return;
    setIsUpdating(true);
    const { data, error } = await supabase
      .from("menu_items")
      .update(updatedData)
      .eq("id", editingItem.id)
      .select()
      .single();

    if (!error && data) {
      setEditingItem(null);
      setMenuItems((prev) =>
        prev.map((m) => (m.id === data.id ? (data as MenuItem) : m)),
      );
      fetchStatsCounts();
    } else {
      alert("Error al actualizar el producto");
    }
    setIsUpdating(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto del menú en vivo?"))
      return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (!error) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      fetchStatsCounts();
    }
  };

  const toggleFeaturedProduct = async (item: MenuItem) => {
    const nextState = !item.is_featured;
    const { error } = await supabase
      .from("menu_items")
      .update({ is_featured: nextState })
      .eq("id", item.id);
    if (!error) {
      setMenuItems((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, is_featured: nextState } : m,
        ),
      );
    } else {
      alert("No se pudo actualizar el estado de producto destacado");
    }
  };

  const toggleSeasonalProduct = async (item: MenuItem) => {
    const nextState = !item.is_seasonal;
    const { error } = await supabase
      .from("menu_items")
      .update({ is_seasonal: nextState })
      .eq("id", item.id);
    if (!error) {
      setMenuItems((prev) =>
        prev.map((m) =>
          m.id === item.id ? { ...m, is_seasonal: nextState } : m,
        ),
      );
      fetchStatsCounts();
    }
  };

  const pendingReviewsCount = useMemo(() => {
    return reviews.filter((r) => !r.is_approved).length;
  }, [reviews]);

  const filteredReservations = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    return reservations.filter((res) => {
      const matchesStatus =
        statusFilter === "all" || res.status === statusFilter;
      const matchesSearch =
        !q ||
        (res.name && res.name.toLowerCase().includes(q)) ||
        (res.email && res.email.toLowerCase().includes(q)) ||
        (res.phone && res.phone.includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [reservations, statusFilter, debouncedSearchQuery]);

  const exportToCSV = async () => {
    const { data: allHistory, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !allHistory || allHistory.length === 0) {
      alert("No hay reservas disponibles para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Fecha Creación",
      "Nombre",
      "Email",
      "Teléfono",
      "Personas",
      "Fecha Reserva",
      "Hora",
      "Zona",
      "Estado",
    ];
    const rows = allHistory.map((r) => [
      r.id,
      r.created_at,
      `"${r.name}"`,
      r.email,
      r.phone,
      r.guests,
      r.reservation_date,
      r.reservation_time,
      `"${r.zone || "Salón Principal"}"`,
      r.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `reservas_velvet_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0C0A09] flex items-center justify-center text-xs text-[#A39B92] px-4">
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-[#14110E] border border-[#2D2620]">
          <RefreshCw className="animate-spin text-[#D57E7E]" size={16} />
          <span>Verificando credenciales de seguridad...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#F8F5F2] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#D57E7E]/5 rounded-full blur-[120px] sm:blur-[180px] pointer-events-none" />

      <AdminHeader
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleBrowserNotifications}
        loading={loading}
        onRefresh={fetchAllData}
        onLogout={handleLogout}
        newArrivalAlert={newArrivalAlert}
      />

      <main className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative z-10">
        <AdminStats stats={stats} />

        {/* Pestañas de Navegación */}
        <div className="flex items-center justify-between border-b border-[#2D2620] pb-4 flex-wrap gap-3">
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => setActiveTab("reservations")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === "reservations"
                  ? "bg-[#D57E7E] text-white shadow-lg shadow-[#D57E7E]/20"
                  : "bg-[#14110E] text-[#A39B92] hover:text-white border border-[#2D2620]"
              }`}
            >
              <Utensils size={14} />
              <span>Reservas ({stats.total})</span>
            </button>

            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                activeTab === "menu"
                  ? "bg-[#D57E7E] text-white shadow-lg shadow-[#D57E7E]/20"
                  : "bg-[#14110E] text-[#A39B92] hover:text-white border border-[#2D2620]"
              }`}
            >
              <Coffee size={14} />
              <span>Catálogo ({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all relative ${
                activeTab === "reviews"
                  ? "bg-[#D57E7E] text-white shadow-lg shadow-[#D57E7E]/20"
                  : "bg-[#14110E] text-[#A39B92] hover:text-white border border-[#2D2620]"
              }`}
            >
              <Star size={14} />
              <span>Reseñas ({reviews.length})</span>
              {pendingReviewsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </div>

          {activeTab === "reservations" && (
            <button
              onClick={exportToCSV}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#181512] hover:bg-[#231F1B] border border-[#2D2620] text-xs font-semibold text-[#C5BCB3] hover:text-white cursor-pointer transition-colors"
            >
              <Download size={13} />
              <span>Exportar Todo a CSV</span>
            </button>
          )}
        </div>

        {/* Vistas por Pestaña */}
        {activeTab === "reservations" && (
          <ReservationsTab
            reservations={filteredReservations}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            updateStatus={updateStatus}
          />
        )}

        {activeTab === "menu" && (
          <MenuTab
            menuItems={menuItems}
            loading={loading}
            onAddProduct={handleAddProduct}
            onToggleFeatured={toggleFeaturedProduct}
            onToggleSeasonal={toggleSeasonalProduct}
            onOpenEdit={(item) => setEditingItem(item)}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsTab
            reviews={reviews}
            loading={loading}
            onApprove={handleApproveReview}
            onDelete={handleDeleteReview}
          />
        )}

        {editingItem && (
          <EditMenuModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onUpdate={handleUpdateProduct}
            isUpdating={isUpdating}
          />
        )}
      </main>
    </div>
  );
}
