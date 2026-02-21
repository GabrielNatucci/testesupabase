"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DashboardOverview() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Dashboard Geral</h2>
            <p className="text-muted-foreground">Visão geral das suas finanças e metas.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Saldo Atual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">R$ 5.432,10</p>
                        <CardDescription className="text-muted-foreground mt-2">Saldo total em suas contas.</CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Gastos do Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-red-500">R$ 1.234,50</p>
                        <CardDescription className="text-muted-foreground mt-2">Total de despesas este mês.</CardDescription>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Metas Ativas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">3</p>
                        <CardDescription className="text-muted-foreground mt-2">Metas em andamento.</CardDescription>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Próximos Vencimentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        <li>
                            <p className="font-semibold">Aluguel:</p>
                            <p className="text-muted-foreground">R$ 1.500,00 - 05/Mar</p>
                        </li>
                        <li>
                            <p className="font-semibold">Cartão de Crédito:</p>
                            <p className="text-muted-foreground">R$ 750,00 - 10/Mar</p>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
