'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { Calendar, Clock, Users, Mail, Phone, RefreshCw, CheckCircle, XCircle, LogOut, Plus, Trash2, Edit, Coffee, Utensils, X } from 'lucide-react';

interface Reservation {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  reservation_date: string;
  reservation_time: string;
  zone?: string;
  status: string;
}

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'menu'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  // Estado Formulario Nuevo Producto
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('cafes');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Estado Edición de Producto
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('cafes');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setAuthenticated(true);
        fetchReservations();
        fetchMenuItems();
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const fetchReservations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    setReservations(data || []);
    setLoading(false);
  };

  const fetchMenuItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    setMenuItems(data || []);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    setIsAdding(true);
    const { error } = await supabase.from('menu_items').insert([
      {
        title: newTitle,
        description: newDesc,
        price: parseFloat(newPrice),
        category: newCategory,
        image_url: newImageUrl || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=600',
      },
    ]);

    if (!error) {
      setNewTitle('');
      setNewDesc('');
      setNewPrice('');
      setNewImageUrl('');
      fetchMenuItems();
    } else {
      alert('Error al agregar el producto');
    }
    setIsAdding(false);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditPrice(item.price.toString());
    setEditCategory(item.category);
    setEditImageUrl(item.image_url);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editTitle || !editPrice) return;

    setIsUpdating(true);
    const { error } = await supabase
      .from('menu_items')
      .update({
        title: editTitle,
        description: editDesc,
        price: parseFloat(editPrice),
        category: editCategory,
        image_url: editImageUrl,
      })
      .eq('id', editingItem.id);

    if (!error) {
      setEditingItem(null);
      fetchMenuItems();
    } else {
      alert('Error al actualizar el producto');
    }
    setIsUpdating(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#100D0A] flex items-center justify-center text-xs text-[#A39B92]">
        Verificando acceso...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#100D0A] text-[#F8F5F2] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header del Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2D2620] pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold">Panel de Administración</h1>
            <p className="text-sm text-[#A39B92] mt-1">Gestión integral de reservas y catálogo de la cafetería</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchReservations(); fetchMenuItems(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#231F1B] hover:bg-[#2D2620] text-xs font-semibold border border-[#2D2620] cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold border border-rose-500/20 cursor-pointer transition-colors"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex gap-4 border-b border-[#2D2620] pb-4">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${activeTab === 'reservations'
              ? 'bg-[#D57E7E] text-white'
              : 'bg-[#181512] text-[#A39B92] hover:text-white border border-[#2D2620]'
              }`}
          >
            <Utensils size={14} /> Reservas ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${activeTab === 'menu'
              ? 'bg-[#D57E7E] text-white'
              : 'bg-[#181512] text-[#A39B92] hover:text-white border border-[#2D2620]'
              }`}
          >
            <Coffee size={14} /> Menú ({menuItems.length})
          </button>
        </div>

        {/* Pestaña Reservas */}
        {activeTab === 'reservations' && (
          <div>
            {loading ? (
              <p className="text-sm text-[#A39B92] text-center py-12">Cargando reservas desde Supabase...</p>
            ) : reservations.length === 0 ? (
              <p className="text-sm text-[#A39B92] text-center py-12">No hay reservas registradas aún.</p>
            ) : (
              <div className="grid gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 rounded-2xl bg-[#181512] border border-[#2D2620] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-base text-white">{res.name}</h3>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${res.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : res.status === 'cancelled'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                        >
                          {res.status === 'confirmed' ? 'Confirmada' : res.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-[#A39B92]">
                        <span className="flex items-center gap-1"><Mail size={12} /> {res.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {res.phone}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {res.guests} personas</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {res.reservation_date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {res.reservation_time}</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#231F1B] text-[#D57E7E] font-medium border border-[#2D2620]">
                          Zona: {res.zone || 'Salón Principal'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => updateStatus(res.id, 'confirmed')}
                        className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <CheckCircle size={16} /> Confirmar
                      </button>
                      <button
                        onClick={() => updateStatus(res.id, 'cancelled')}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <XCircle size={16} /> Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pestaña Menú */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Formulario para Agregar Producto */}
            <form onSubmit={handleAddProduct} className="p-6 rounded-2xl bg-[#181512] border border-[#2D2620] space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus size={18} className="text-[#D57E7E]" /> Agregar Nuevo Producto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Precio en $"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  className="p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                >
                  <option value="cafes">Cafés y Bebidas</option>
                  <option value="postres">Postres y Repostería</option>
                  <option value="especiales">Especiales de la Casa</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Descripción corta"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                />
                <input
                  type="url"
                  placeholder="URL de Imagen (Unsplash o CDN)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="px-6 py-2.5 rounded-xl bg-[#D57E7E] text-white text-xs font-semibold hover:bg-[#c26d6d] transition-all cursor-pointer disabled:opacity-50"
              >
                {isAdding ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </form>

            {/* Listado de Productos con Editar y Eliminar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#181512] border border-[#2D2620] flex gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-sm text-white">{item.title}</h3>
                      <p className="text-xs text-[#A39B92] line-clamp-1">{item.description}</p>
                      <span className="text-xs font-semibold text-[#D57E7E] mt-1 block">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      title="Editar Producto"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(item.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                      title="Eliminar Producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal para Editar Producto */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#181512] border border-[#2D2620] rounded-3xl p-6 max-w-lg w-full space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Editar Producto</h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-[#A39B92] hover:text-white cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#A39B92] mb-1">Título</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#A39B92] mb-1">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A39B92] mb-1">Categoría</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                    >
                      <option value="cafes">Cafés</option>
                      <option value="postres">Postres</option>
                      <option value="especiales">Especiales</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A39B92] mb-1">Descripción</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A39B92] mb-1">URL Imagen</label>
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] text-sm text-white focus:border-[#D57E7E] outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-[#231F1B] text-[#A39B92] text-xs font-semibold hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-1/2 py-2.5 rounded-xl bg-[#D57E7E] text-white text-xs font-semibold hover:bg-[#c26d6d] cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? 'Actualizando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}