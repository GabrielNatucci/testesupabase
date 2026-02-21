"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";

export function AuthButton({ user }: { user: { email: string } | undefined }) {
    return user ? (
        <div className="flex items-center gap-4">
            Olá, {user.email}!
            <LogoutButton />
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
                <Link href="/auth/sign-up">Inscrever-se</Link>
            </Button>
        </div>
    );
}