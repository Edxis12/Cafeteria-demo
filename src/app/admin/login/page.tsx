'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { Lock, Mail, Key } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('Credenciales inválidas. Verifica tu correo y contraseña.');
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-[#100D0A] text-[#F8F5F2] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#181512] border border-[#2D2620] rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-[#D57E7E]/10 text-[#D57E7E] rounded-2xl flex items-center justify-center mx-auto">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold">Acceso Administrativo</h1>
                    <p className="text-xs text-[#A39B92]">Ingresa tus credenciales para gestionar el negocio</p>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-[#A39B92]">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@velvet.com"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] focus:border-[#D57E7E] outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-[#A39B92]">Contraseña</label>
                        <div className="relative">
                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#231F1B] border border-[#2D2620] focus:border-[#D57E7E] outline-none text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#D57E7E] text-white font-semibold text-sm hover:bg-[#c26d6d] transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}