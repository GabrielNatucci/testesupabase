"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useMemo } from "react"; // Adicionado useMemo
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { format, parseISO } from "date-fns"; // Adicionado parseISO e import format from date-fns for date handling
import { ptBR } from 'date-fns/locale'; // Adicionado ptBR locale

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'; // Novas importações do recharts
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

// Define Expense type
interface Expense {
    id: string;
    user_id: string;
    created_at: string;
    name: string;
    amount: number;
    recurrence: 'daily' | 'weekly' | 'monthly' | 'once';
    category: string;
    date: string; // date of expense (e.g., "2024-02-21")
}

export function ExpensesManagement() {
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseRecurrence, setExpenseRecurrence] = useState<Expense['recurrence']>('once'); // Default to once
    const [expenseCategory, setExpenseCategory] = useState("Alimentação"); // Default category for form
    const [expenses, setExpenses] = useState<Expense[]>([]); // Initialize with empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null); // New state for form-specific errors
    const [openAddExpenseDialog, setOpenAddExpenseDialog] = useState(false); // New state to control dialog visibility
    const [selectedCategoryForChart, setSelectedCategoryForChart] = useState("all"); // "all" for all categories

    // Helper to translate recurrence types
    const translateRecurrence = (recurrenceType: Expense['recurrence']) => {
        switch (recurrenceType) {
            case 'daily':
                return 'Diária';
            case 'weekly':
                return 'Semanal';
            case 'monthly':
                return 'Mensal';
            case 'once':
                return 'Única';
            default:
                return recurrenceType;
        }
    };

    const expenseCategories = ["Alimentação", "Transporte", "Moradia", "Lazer", "Educação", "Saúde", "Outros"];

    // Fetch expenses from Supabase
    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            setError(null);
            const supabase = createClient();
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                setError("Usuário não autenticado. Por favor, faça login.");
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: true }); // Order by date for chart

            if (fetchError) {
                console.error("Erro ao buscar despesas:", fetchError);
                setError(fetchError.message);
            } else {
                const clientExpenses: Expense[] = data.map((dbExpense: any) => ({
                    id: dbExpense.id,
                    user_id: dbExpense.user_id,
                    created_at: dbExpense.created_at,
                    name: dbExpense.name,
                    amount: dbExpense.amount,
                    recurrence: dbExpense.recurrence,
                    category: dbExpense.category,
                    date: dbExpense.date,
                }));
                setExpenses(clientExpenses);
            }
            setLoading(false);
        };

        fetchExpenses();
    }, []);

    const addExpense = async () => {
        setFormError(null); // Clear previous form errors
        if (!expenseName || !expenseAmount || !expenseCategory) {
            setFormError("Nome, valor e categoria da despesa são obrigatórios.");
            return;
        }

        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            setError("Usuário não autenticado. Por favor, faça login para adicionar despesas.");
            setLoading(false);
            return;
        }

        const newExpenseData = {
            user_id: user.id,
            name: expenseName,
            amount: parseFloat(expenseAmount),
            recurrence: expenseRecurrence,
            category: expenseCategory,
            date: new Date().toISOString().split('T')[0], // Use current date for new expense
        };

        const { data, error: insertError } = await supabase
            .from('expenses')
            .insert(newExpenseData)
            .select();

        if (insertError) {
            console.error("Erro ao adicionar despesa:", insertError);
            setFormError(insertError.message); // Set form-specific error
        } else if (data && data.length > 0) {
            const addedExpense: Expense = {
                id: data[0].id,
                user_id: data[0].user_id,
                created_at: data[0].created_at,
                name: data[0].name,
                amount: data[0].amount,
                recurrence: data[0].recurrence,
                category: data[0].category,
                date: data[0].date,
            };
            setExpenses(prev => [...prev, addedExpense]);
            setExpenseName("");
            setExpenseAmount("");
            setExpenseRecurrence('once');
            setExpenseCategory("Alimentação");
            setOpenAddExpenseDialog(false); // Close dialog on success
        }
        setLoading(false);
    };

    const handleDeleteExpense = async (expenseId: string) => {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const { error: deleteError } = await supabase
            .from('expenses')
            .delete()
            .eq('id', expenseId);

        if (deleteError) {
            console.error("Erro ao apagar despesa:", deleteError);
            setError(deleteError.message);
        } else {
            setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
        }
        setLoading(false);
    };

    // Prepare data for the chart
    const chartData = useMemo(() => {
        const dataMap: { [key: string]: { month: string; total: number; [key: string]: any } } = {};

        const filteredExpenses = selectedCategoryForChart === "all"
            ? expenses
            : expenses.filter(expense => expense.category === selectedCategoryForChart);

        filteredExpenses.forEach(expense => {
            const date = parseISO(expense.date);
            const monthYear = format(date, 'MMM/yyyy', { locale: ptBR });

            if (!dataMap[monthYear]) {
                dataMap[monthYear] = { month: monthYear, total: 0 };
            }
            dataMap[monthYear].total += expense.amount;
        });

        // Convert map to array and sort by date
        const sortedData = Object.values(dataMap).sort((a, b) => {
            const [monthA, yearA] = a.month.split('/');
            const [monthB, yearB] = b.month.split('/');

            const dateA = new Date(`${yearA}-${monthA}-01`);
            const dateB = new Date(`${yearB}-${monthB}-01`);
            return dateA.getTime() - dateB.getTime();
        });

        return sortedData;
    }, [expenses, selectedCategoryForChart]);


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando despesas...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Erro: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Gastos</h2>
            <p className="text-muted-foreground">Registre e acompanhe suas despesas.</p>

            <div className="flex justify-end mb-4">
                <Dialog open={openAddExpenseDialog} onOpenChange={setOpenAddExpenseDialog}>
                    <DialogTrigger asChild>
                        <Button>Adicionar Nova Despesa</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar Nova Despesa</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes para adicionar uma nova despesa.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="expenseName">Nome da Despesa</Label>
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
                            <div className="grid gap-2">
                                <Label htmlFor="expenseRecurrence">Recorrência</Label>
                                <Select value={expenseRecurrence} onValueChange={(value: Expense['recurrence']) => setExpenseRecurrence(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a recorrência" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="once">Única</SelectItem>
                                        <SelectItem value="daily">Diária</SelectItem>
                                        <SelectItem value="weekly">Semanal</SelectItem>
                                        <SelectItem value="monthly">Mensal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="expenseCategory">Categoria</Label>
                                <Select value={expenseCategory} onValueChange={(value: string) => setExpenseCategory(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {expenseCategories.map(category => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {formError && <p className="text-sm text-red-500">{formError}</p>}
                            <Button onClick={addExpense} className="bg-primary text-primary-foreground hover:bg-primary/90">Adicionar Despesa</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Dashboard de Gastos</CardTitle>
                    <CardDescription className="text-muted-foreground">Visualize o histórico e o crescimento/diminuição das suas despesas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="chartCategory">Filtrar por Categoria</Label>
                            <Select value={selectedCategoryForChart} onValueChange={(value: string) => setSelectedCategoryForChart(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todas as Categorias" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Categorias</SelectItem>
                                    {expenseCategories.map(category => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {chartData.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? `R$ ${value.toFixed(2)}` : 'N/A'} />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} name="Total de Gastos" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <CardDescription className="text-muted-foreground">
                                Não há dados de despesas para exibir o gráfico.
                            </CardDescription>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Minhas Despesas</CardTitle>
                    <CardDescription className="text-muted-foreground">Gerencie todas as suas despesas cadastradas.</CardDescription>
                </CardHeader>
                <CardContent>
                    {expenses.length > 0 ? (
                        <ul className="space-y-4">
                            {expenses.map((expense) => (
                                <li key={expense.id} className="flex flex-col gap-2 border-b border-border py-2 last:border-b-0">
                                    <div className="flex items-center justify-between">
                                        <div className="grid gap-1.5 leading-none">
                                            <p className="text-sm font-medium text-foreground">{expense.name}</p>
                                            <p className="text-sm text-muted-foreground">Categoria: {expense.category}</p>
                                            <p className="text-sm text-muted-foreground">Recorrência: {translateRecurrence(expense.recurrence)}</p>
                                            <p className="text-sm text-muted-foreground">Data: {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => alert("Funcionalidade de edição em breve!")}>
                                                Editar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                                                Apagar
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-red-500 font-bold">R$ {expense.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <CardDescription className="text-muted-foreground">Nenhuma despesa registrada ainda.</CardDescription>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
