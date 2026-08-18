'use client';

import { useState, useMemo } from 'react';
import {
  Coffee,
  Cake,
  Sparkles,
  Search,
  X,
  Info,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured?: boolean;
  is_seasonal?: boolean;
  badge?: string;
}

interface InteractiveMenuProps {
  initialItems?: MenuItem[];
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=600';

const ITEMS_PER_PAGE = 6;

function unescapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x60;/g, '`');
}

function getProductSpecs(item: MenuItem) {
  const title = (item.title || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();

  // Matcha y Tés
  if (title.includes('matcha') || desc.includes('matcha') || title.includes('té') || title.includes('tea')) {
    return {
      label1: 'Grado:',
      val1: 'Ceremonial Japonés',
      label2: 'Perfil:',
      val2: 'Herbal & Umami',
    };
  }

  // Postres y Panadería
  if (item.category === 'postres' || title.includes('croissant') || title.includes('pastel') || title.includes('pan')) {
    return {
      label1: 'Elaboración:',
      val1: 'Masa Madre & Mantequilla',
      label2: 'Horneado:',
      val2: 'Diario (7:00 AM)',
    };
  }

  // Bebidas frías / Cold Brew / Frappés
  if (
    title.includes('cold brew') ||
    title.includes('frapp') ||
    title.includes('tonic') ||
    title.includes('ice') ||
    title.includes('helado')
  ) {
    return {
      label1: 'Extracción:',
      val1: 'Infusión en Frío 18h',
      label2: 'Servido:',
      val2: 'Hielo Cristalino',
    };
  }

  // Cafés de Oaxaca
  if (title.includes('oaxaca') || desc.includes('oaxaca') || title.includes('pluma')) {
    return {
      label1: 'Origen:',
      val1: 'Pluma Hidalgo, Oaxaca',
      label2: 'Tueste:',
      val2: 'Medio Claro',
    };
  }

  // Café de Especialidad estándar
  return {
    label1: 'Origen:',
    val1: 'Chiapas (1,400 msnm)',
    label2: 'Tueste:',
    val2: 'Medio Artesanal',
  };
}

export function InteractiveMenu({ initialItems = [] }: InteractiveMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items] = useState<MenuItem[]>(initialItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filtrado reactivo de productos en memoria (0 consultas de red)
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  // Cálculo de Paginación
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

  // Productos visibles en la página actual
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2.5 sm:space-y-3">
        <span className="inline-block text-[#D57E7E] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase px-3.5 py-1 rounded-full bg-[#D57E7E]/10 border border-[#D57E7E]/20">
          Menú Especializado
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F8F5F2] tracking-tight">
          Nuestra Selección
        </h2>
        <p className="text-xs sm:text-sm text-[#C5BCB3] leading-relaxed px-2">
          Explora nuestros cafés de especialidad, bebidas artesanales y repostería recién horneada.
        </p>
      </div>

      {/* Buscador + Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sm:mb-10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D57E7E]" size={16} />
          <input
            type="text"
            placeholder="Buscar espresso, croissant..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 sm:py-3 rounded-full bg-[#181512] border border-[#2D2620] focus:border-[#D57E7E] text-xs text-[#F8F5F2] outline-none transition-colors shadow-sm placeholder:text-[#A39B92]"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A39B92] hover:text-white cursor-pointer p-1"
              title="Borrar búsqueda"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap w-full md:w-auto">
          {[
            { id: 'todos', label: 'Todos', icon: Sparkles },
            { id: 'cafes', label: 'Cafés', icon: Coffee },
            { id: 'postres', label: 'Postres', icon: Cake },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${isActive ? 'text-white' : 'text-[#A39B92] hover:text-white'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-[#D57E7E] rounded-full -z-10 shadow-md shadow-[#D57E7E]/20"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon size={14} className="relative z-10 shrink-0" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Productos con Animaciones Reactivas */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 space-y-3"
        >
          <p className="text-sm font-semibold text-[#A39B92]">
            No encontramos resultados para "{searchQuery}"
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('todos');
              setCurrentPage(1);
            }}
            className="text-xs text-[#D57E7E] underline cursor-pointer font-bold uppercase tracking-wider"
          >
            Limpiar búsqueda y mostrar todo
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 15 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  onClick={() => setSelectedItem(item)}
                  className="group relative rounded-3xl bg-[#14110E] border border-[#2D2620] hover:border-[#D57E7E]/40 transition-colors duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-4 cursor-pointer shadow-lg will-change-transform transform-gpu hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden rounded-2xl h-44 sm:h-48 w-full bg-black">
                    <img
                      src={item.image_url || DEFAULT_IMAGE}
                      alt={unescapeHtml(item.title)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-[#F8F5F2] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                      {item.category === 'cafes'
                        ? 'Café'
                        : item.category === 'postres'
                          ? 'Postre'
                          : 'Especial'}
                    </span>

                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Info size={14} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#F8F5F2] group-hover:text-[#D57E7E] transition-colors duration-200">
                      {unescapeHtml(item.title)}
                    </h3>
                    <p className="text-xs text-[#A39B92] line-clamp-2 leading-relaxed">
                      {unescapeHtml(item.description)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#2D2620]">
                    <span className="font-bold text-xs sm:text-sm text-[#D57E7E] bg-[#D57E7E]/10 px-2.5 sm:px-3 py-1 rounded-full border border-[#D57E7E]/20">
                      ${Number(item.price || 0).toFixed(2)} MXN
                    </span>
                    <span className="text-[11px] text-[#A39B92] font-bold uppercase tracking-wider group-hover:text-[#D57E7E] transition-colors flex items-center gap-0.5">
                      Detalles <ArrowUpRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Paginación Reactiva */}
          {totalPages > 1 && (
            <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#14110E] border border-[#2D2620]">
              <span className="text-xs text-[#A39B92]">
                Mostrando{' '}
                <span className="text-white font-semibold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}
                </span>{' '}
                de <span className="text-white font-semibold">{filteredItems.length}</span> productos
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-[#1C1814] border border-[#2D2620] text-[#A39B92] hover:text-white hover:border-white/20 disabled:opacity-30 disabled:hover:text-[#A39B92] disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Página anterior"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                        ? 'bg-[#D57E7E] text-white shadow-md shadow-[#D57E7E]/20'
                        : 'bg-[#1C1814] text-[#A39B92] hover:text-white border border-[#2D2620]'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-[#1C1814] border border-[#2D2620] text-[#A39B92] hover:text-white hover:border-white/20 disabled:opacity-30 disabled:hover:text-[#A39B92] disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Página siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de Detalle */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 cursor-pointer overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#14110E] border border-[#2D2620] rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl cursor-default my-auto"
            >
              <div className="relative">
                <img
                  src={selectedItem.image_url || DEFAULT_IMAGE}
                  alt={unescapeHtml(selectedItem.title)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                  }}
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors cursor-pointer border border-white/10"
                  title="Cerrar"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D57E7E] bg-[#D57E7E]/10 px-2.5 py-1 rounded-full border border-[#D57E7E]/20">
                      {selectedItem.category === 'cafes'
                        ? 'Café de Especialidad'
                        : selectedItem.category === 'postres'
                          ? 'Repostería Artesanal'
                          : 'Especialidad'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F8F5F2] mt-2">
                      {unescapeHtml(selectedItem.title)}
                    </h3>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-[#D57E7E] shrink-0 font-serif">
                    ${Number(selectedItem.price || 0).toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-[#A39B92] leading-relaxed">
                  {unescapeHtml(selectedItem.description)}
                </p>

                {(() => {
                  const specs = getProductSpecs(selectedItem);
                  return (
                    <div className="p-3.5 rounded-2xl bg-[#1C1814] border border-[#2D2620] grid grid-cols-2 gap-2 text-[11px] text-[#A39B92]">
                      <div>
                        <span className="font-semibold text-gray-300 block">{specs.label1}</span>
                        <span className="text-[#F8F5F2]">{specs.val1}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-300 block">{specs.label2}</span>
                        <span className="text-[#F8F5F2]">{specs.val2}</span>
                      </div>
                    </div>
                  );
                })()}

                <a
                  href="#reservas"
                  onClick={() => setSelectedItem(null)}
                  className="block text-center w-full py-3.5 rounded-2xl bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#c26d6d] transition-colors cursor-pointer shadow-lg shadow-[#D57E7E]/20 min-h-[44px]"
                >
                  Reservar mesa para probarlo
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}