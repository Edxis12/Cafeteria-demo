import { NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';

export async function POST() {
    try {
        await supabase.auth.signOut();
        const response = NextResponse.json({ success: true });
        // Limpiar cookies de sesión si existen
        response.cookies.delete('sb-access-token');
        response.cookies.delete('sb-refresh-token');
        return response;
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}