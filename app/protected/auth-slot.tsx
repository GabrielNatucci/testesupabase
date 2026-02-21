"use client";

import { createClient } from "@/lib/supabase/client"; // Use client-side Supabase client
import { AuthButton } from "@/components/auth-button";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js"; // Import User type

export function AuthSlot() {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession(); // Use getSession for client
            setUser(data.session?.user);
            setLoading(false);
        };

        fetchUser();
    }, []); // Removed router from dependency array

    if (loading) {
        return <div>Carregando...</div>; // Or a spinner
    }

    // AuthButton expects { email: string } | undefined for user
    const authButtonUser = user ? { email: user.email! } : undefined;

    return <AuthButton user={authButtonUser} />;
}

