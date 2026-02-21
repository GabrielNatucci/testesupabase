"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Goal, Lightbulb, ShieldCheck } from "lucide-react";
import { AuthSlot } from "@/app/protected/auth-slot"; // Import AuthSlot
import { ThemeSwitcher } from "@/components/theme-switcher"; // Import ThemeSwitcher

export function LandingPage() {
    return (
        <main className="min-h-screen flex flex-col items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                        <Link href={"/"}>FinanSync</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <AuthSlot /> {/* Render AuthSlot */}
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>

            <div className="flex-1 w-full flex flex-col items-center justify-center p-6 md:p-10 bg-background text-foreground">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl">
                        FinanSync
                    </h1>
                    <p className="mt-6 text-xl leading-8 text-muted-foreground">
                        Assuma o controle de suas finanças, defina e alcance suas metas de vida com nossa plataforma intuitiva e poderosa. Seu futuro financeiro começa aqui.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button asChild size="lg" className="px-6 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href="/auth/sign-up">Comece com FinanSync</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="px-6 py-3 text-lg border-primary text-primary hover:bg-primary/10">
                            <Link href="/auth/login">Entrar</Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
                    <Card className="flex flex-col items-center text-center p-6 bg-card text-card-foreground border-border">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">Controle Financeiro</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-muted-foreground">
                                Visualize seus gastos, receitas e poupanças em um só lugar. Categorize transações e entenda para onde seu dinheiro está indo.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col items-center text-center p-6 bg-card text-card-foreground border-border">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">Definição de Metas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-muted-foreground">
                                Crie metas financeiras e pessoais, acompanhe seu progresso e receba lembretes para mantê-lo no caminho certo.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col items-center text-center p-6 bg-card text-card-foreground border-border">
                        <CardHeader>
                            <CardTitle className="text-2xl text-primary">Insights Personalizados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-muted-foreground">
                                Receba análises e recomendações personalizadas para otimizar suas finanças e acelerar o alcance de suas metas.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <section className="w-full max-w-5xl mt-20 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                        Por que escolher FinanSync?
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        FinanSync é mais do que um gerenciador de finanças; é seu parceiro para uma vida financeira mais saudável e um futuro mais brilhante.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col items-center p-4">
                            <DollarSign size={48} className="text-primary mb-4" />
                            <h3 className="text-xl font-semibold text-foreground">Economize Dinheiro</h3>
                            <p className="mt-2 text-muted-foreground">Identifique gastos desnecessários e otimize seu orçamento com facilidade.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <Goal size={48} className="text-primary mb-4" />
                            <h3 className="text-xl font-semibold text-foreground">Alcance Suas Metas</h3>
                            <p className="mt-2 text-muted-foreground">Defina e acompanhe o progresso de suas metas financeiras e pessoais.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <Lightbulb size={48} className="text-primary mb-4" />
                            <h3 className="text-xl font-semibold text-foreground">Conhecimento Financeiro</h3>
                            <p className="mt-2 text-muted-foreground">Obtenha insights claros sobre seus hábitos financeiros para tomar decisões inteligentes.</p>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            <ShieldCheck size={48} className="text-primary mb-4" />
                            <h3 className="text-xl font-semibold text-foreground">Segurança e Privacidade</h3>
                            <p className="mt-2 text-muted-foreground">Seus dados são protegidos com a mais alta segurança e privacidade.</p>
                        </div>
                    </div>
                </section>
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
