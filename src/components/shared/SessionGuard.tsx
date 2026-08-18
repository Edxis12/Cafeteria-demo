'use client';

import { useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export function SessionGuard() {
    useEffect(() => {
        supabase.auth.signOut();
    }, []);

    return null;
}