"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function BudgetManagement() {
    const [budgetItem, setBudgetItem] = useState("");
    const [budgetAmount, setBudgetAmount] = useState("");
    const [budgets, setBudgets] = useState([
        { id: 1, item: "Moradia", allocated: 2000, spent: 1500 },
        { id: 2, item: "Alimentação", allocated: 800, spent: 450 },
        { id: 3, item: "Transporte", allocated: 300, spent: 150 },
    ]);

    const addBudget = () => {
        if (budgetItem && budgetAmount) {
            setBudgets([...budgets, { id: budgets.length + 1, item: budgetItem, allocated: parseFloat(budgetAmount), spent: 0 }]);
            setBudgetItem("");
            setBudgetAmount("");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Orçamento</h2>
            <p className="text-muted-foreground">Defina e acompanhe seus orçamentos por categoria.</p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Adicionar Novo Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="budgetItem">Item de Orçamento</Label>
                            <Input
                                id="budgetItem"
                                type="text"
                                placeholder="Ex: Lazer"
                                value={budgetItem}
                                onChange={(e) => setBudgetItem(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="budgetAmount">Valor Alocado</Label>
                            <Input
                                id="budgetAmount"
                                type="number"
                                placeholder="Ex: 500.00"
                                value={budgetAmount}
                                onChange={(e) => setBudgetAmount(e.target.value)}
                            />
                        </div>
                        <Button onClick={addBudget} className="bg-primary text-primary-foreground hover:bg-primary/90">Adicionar Orçamento</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Meus Orçamentos</CardTitle>
                </CardHeader>
                <CardContent>
                    {budgets.length > 0 ? (
                        <ul className="space-y-4">
                            {budgets.map((budget) => (
                                <li key={budget.id} className="flex flex-col border-b border-border py-2 last:border-b-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{budget.item}</p>
                                        <p className="font-bold">R$ {budget.spent.toFixed(2)} / R$ {budget.allocated.toFixed(2)}</p>
                                    </div>
                                    <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-1">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${(budget.spent / budget.allocated) * 100}%` }}
                                        ></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <CardDescription className="text-muted-foreground">Nenhum orçamento definido ainda.</CardDescription>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
