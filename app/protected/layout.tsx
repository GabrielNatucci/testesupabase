"use client";

import { AuthSlot } from "@/app/protected/auth-slot"; // Direct import of AuthSlot
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { SidebarNav } from "@/components/protected/sidebar-nav";
import { LayoutDashboard, Wallet, PiggyBank, Target, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react"; // Import useState and useEffect
import { createClient } from "@/lib/supabase/client"; // Import client-side supabase client

const sidebarNavItems = [
    {
        href: "/protected",
        title: "Dashboard",
        icon: <LayoutDashboard size={16} />,
    },
    {
        href: "/protected/expenses",
        title: "Gastos",
        icon: <Wallet size={16} />,
    },
    {
        href: "/protected/budget",
        title: "Orçamento",
        icon: <PiggyBank size={16} />,
    },
    {
        href: "/protected/goals",
        title: "Metas",
        icon: <Target size={16} />,
    },
    {
        href: "/protected/ai-chat",
        title: "Chat IA",
        icon: <MessageSquare size={16} />,
    },
];

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null); // State to hold user info

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                router.push("/auth/login");
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };

        checkUser();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    // Only render children if user is authenticated
    if (!user) {
        return null; // Or some message/spinner, but redirection should handle it
    }

    return (
        <main className="min-h-screen flex flex-col">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                        <Link href={"/protected"}>FinanSync</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <AuthSlot /> {/* AuthSlot will render the AuthButton based on session */}
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>
            <div className="flex-1 w-full max-w-7xl mx-auto flex">
                <aside className="w-64 border-r border-r-foreground/10 p-5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 p-5">
                    {children}
                </div>
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                    Desenvolvido por{" "}
                    <a
                        href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                    >
                        Supabase
                    </a>
                </p>
            </footer>
        </main>
    );
}
