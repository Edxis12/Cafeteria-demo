'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Coffee, Cake, Sparkles, Search, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export function InteractiveMenu() {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function loadMenu() {
      const { data, error } = await supabase.from('menu_items').select('*');
      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }
    loadMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === 'todos' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <span className="text-[#D57E7E] text-xs font-semibold tracking-widest uppercase">
          Menú Especializado
        </span>
        <h2 className="text-3xl font-serif font-bold text-[#1A120B] dark:text-[#F8F5F2]">
          Nuestra Selección
        </h2>
        <p className="text-xs text-gray-500 dark:text-[#A39B92]">
          Explora nuestros cafés de especialidad, bebidas artesanales y repostería recién horneada.
        </p>
      </div>

      {/* Controles: Buscador + Filtros Animados */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        {/* Barra de Búsqueda */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar espresso, croissant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded-full bg-black/5 dark:bg-[#181512] border border-transparent focus:border-[#D57E7E] text-xs text-[#1A120B] dark:text-[#F8F5F2] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtros por Categoría con alto contraste */}
        <div className="flex justify-center gap-2 flex-wrap w-full md:w-auto">
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
                onClick={() => setActiveCategory(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${isActive
                    ? 'text-white'
                    : 'text-gray-600 dark:text-[#A39B92] hover:text-black dark:hover:text-white'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterTab"
                    className="absolute inset-0 bg-[#D57E7E] rounded-full -z-10 shadow-lg shadow-[#D57E7E]/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Productos con Animación de Disposición */}
      {loading ? (
        <p className="text-center text-xs text-[#A39B92] py-12">Cargando menú...</p>
      ) : filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-2"
        >
          <p className="text-sm font-semibold text-gray-600 dark:text-[#A39B92]">
            No encontramos resultados para "{searchQuery}"
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
            className="text-xs text-[#D57E7E] underline cursor-pointer"
          >
            Limpiar búsqueda y filtros
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedItem(item)}
                className="group p-4 rounded-2xl bg-white dark:bg-[#181512] border border-black/5 dark:border-[#2D2620] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={14} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A120B] dark:text-[#F8F5F2]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-[#A39B92] mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/5 dark:border-[#2D2620]">
                  <span className="font-bold text-sm text-[#D57E7E]">
                    ${item.price.toFixed(2)} MXN
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-[#A39B92] font-medium group-hover:text-[#D57E7E] transition-colors">
                    Ver detalle →
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal de Detalle con Animación de Pop-up */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#181512] border border-black/10 dark:border-[#2D2620] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl cursor-default"
            >
              <div className="relative">
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.title}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D57E7E] bg-[#D57E7E]/10 px-2 py-0.5 rounded-full">
                      {selectedItem.category === 'cafes'
                        ? 'Café de Especialidad'
                        : selectedItem.category === 'postres'
                          ? 'Repostería Artesanal'
                          : 'Especialidad'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#1A120B] dark:text-[#F8F5F2] mt-1">
                      {selectedItem.title}
                    </h3>
                  </div>
                  <span className="text-xl font-bold text-[#D57E7E]">
                    ${selectedItem.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-[#A39B92] leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="p-3 rounded-2xl bg-black/5 dark:bg-[#231F1B] border border-black/5 dark:border-[#2D2620] grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-[#A39B92]">
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Origen:</span>
                    <span>Chiapas, México</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Tueste:</span>
                    <span>Medio Artesanal</span>
                  </div>
                </div>

                <a
                  href="#reservas"
                  onClick={() => setSelectedItem(null)}
                  className="block text-center w-full py-3 rounded-xl bg-[#D57E7E] text-white font-semibold text-xs hover:bg-[#c26d6d] transition-all cursor-pointer"
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