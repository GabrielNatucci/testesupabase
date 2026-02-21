"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ExpensesManagement() {
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenses, setExpenses] = useState([
        { id: 1, name: "Aluguel", amount: 1500, date: "2024-02-01" },
        { id: 2, name: "Supermercado", amount: 450, date: "2024-02-05" },
        { id: 3, name: "Transporte", amount: 150, date: "2024-02-07" },
    ]);

    const addExpense = () => {
        if (expenseName && expenseAmount) {
            setExpenses([...expenses, { id: expenses.length + 1, name: expenseName, amount: parseFloat(expenseAmount), date: new Date().toISOString().split('T')[0] }]);
            setExpenseName("");
            setExpenseAmount("");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Gastos</h2>
            <p className="text-muted-foreground">Registre e acompanhe suas despesas.</p>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Adicionar Novo Gasto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expenseName">Nome do Gasto</Label>
                            <Input
                                id="expenseName"
                                type="text"
                                placeholder="Ex: Conta de Luz"
                                value={expenseName}
                                onChange={(e) => setExpenseName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="expenseAmount">Valor</Label>
                            <Input
                                id="expenseAmount"
                                type="number"
                                placeholder="Ex: 150.00"
                                value={expenseAmount}
                                onChange={(e) => setExpenseAmount(e.target.value)}
                            />
                        </div>
                        <Button onClick={addExpense} className="bg-primary text-primary-foreground hover:bg-primary/90">Adicionar Gasto</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Meus Gastos</CardTitle>
                </CardHeader>
                <CardContent>
                    {expenses.length > 0 ? (
                        <ul className="space-y-2">
                            {expenses.map((expense) => (
                                <li key={expense.id} className="flex justify-between items-center border-b border-border py-2 last:border-b-0">
                                    <div>
                                        <p className="font-semibold">{expense.name}</p>
                                        <p className="text-muted-foreground text-sm">{expense.date}</p>
                                    </div>
                                    <p className="text-red-500 font-bold">R$ {expense.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <CardDescription className="text-muted-foreground">Nenhum gasto registrado ainda.</CardDescription>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
