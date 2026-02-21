"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { format, addDays, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns"; // Import date utilities
import { ptBR } from 'date-fns/locale'; // Import locale for pt-BR
import { createClient } from "@/lib/supabase/client"; // Import Supabase client
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

// Define Goal type
interface Goal {
    id: string; // Changed to string for UUID from Supabase
    user_id: string; // Added user_id
    created_at: string; // Added created_at
    name: string;
    description: string;
    recurrence: 'daily' | 'weekly' | 'monthly' | 'once';
    days_of_week?: number[]; // Column name changed to match DB convention
    target_value?: number; // Column name changed to match DB convention
    progress: { date: string, value?: number, completed: boolean }[];
}

// Helper to get dates between two dates
const getDatesBetween = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = start;
    while (currentDate <= end) {
        dates.push(currentDate);
        currentDate = addDays(currentDate, 1);
    }
    return dates;
};

export function GoalsManagement() {
        const [goalName, setGoalName] = useState("");
        const [goalDescription, setGoalDescription] = useState("");
        const [recurrence, setRecurrence] = useState<Goal['recurrence']>('daily');
        const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);
        const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
        const [goals, setGoals] = useState<Goal[]>([]);
        const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [formError, setFormError] = useState<string | null>(null); // New state for form-specific errors
        const [openAddGoalDialog, setOpenAddGoalDialog] = useState(false); // Control dialog open state

        // Helper to format days of week for display
    const formatDaysOfWeek = (days?: number[]) => {
        if (!days || days.length === 0) return "N/A";
        const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        return days.map(day => dayNames[day]).join(", ");
    };

    // Helper to translate recurrence types
    const translateRecurrence = (recurrenceType: Goal['recurrence']) => {
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

    const handleDeleteGoal = async (goalId: string) => {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const { error: deleteError } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId);

        if (deleteError) {
            console.error("Erro ao apagar meta:", deleteError);
            setError(deleteError.message);
        } else {
            setGoals(prev => prev.filter(goal => goal.id !== goalId));
        }
        setLoading(false);
    };

    // Use useEffect to set selectedDate after component mounts
        useEffect(() => {
            const today = new Date();
            setSelectedDate(today);
            setDisplayMonth(today); // Initialize displayMonth with today
        }, []);    
    // Fetch goals from Supabase
    useEffect(() => {
        const fetchGoals = async () => {
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
                .from('goals')
                .select('*')
                .eq('user_id', user.id);

            if (fetchError) {
                console.error("Erro ao buscar metas:", fetchError);
                setError(fetchError.message);
            } else {
                // Transform fetched data to match client-side Goal interface structure
                // Assuming 'progress' is not directly stored in the 'goals' table
                const clientGoals: Goal[] = data.map((dbGoal: any) => ({
                    id: dbGoal.id,
                    user_id: dbGoal.user_id,
                    created_at: dbGoal.created_at,
                    name: dbGoal.name,
                    description: dbGoal.description,
                    recurrence: dbGoal.recurrence,
                    days_of_week: dbGoal.days_of_week || undefined,
                    target_value: dbGoal.target_value || undefined,
                    progress: [], // Initialize empty progress for now, will be handled separately
                }));
                setGoals(clientGoals);
            }
            setLoading(false);
        };

        fetchGoals();
    }, []); // Empty dependency array means this runs once on mount
    
        const handleDayToggle = (dayIndex: number) => {
            setSelectedDaysOfWeek(prev =>
                prev.includes(dayIndex)
                    ? prev.filter(day => day !== dayIndex)
                    : [...prev, dayIndex].sort()
            );
        };
    
            const addGoal = async () => {
                setFormError(null); // Clear previous form errors
                if (!goalName || !goalDescription) {
                    setFormError("Nome e descrição da meta são obrigatórios.");
                    return;
                }
        
                const supabase = createClient();
                const { data: { user }, error: userError } = await supabase.auth.getUser();
        
                if (userError || !user) {
                    setError("Usuário não autenticado. Por favor, faça login para adicionar metas.");
                    return;
                }
        
                setLoading(true);
                setError(null);
        
                const newGoalData = {
                    user_id: user.id,
                    name: goalName,
                    description: goalDescription,
                    recurrence: recurrence,
                    days_of_week: recurrence === 'weekly' ? selectedDaysOfWeek : null,
                    target_value: null, // For simplicity, target_value is null for now
                };
        
                const { data, error: insertError } = await supabase
                    .from('goals')
                    .insert(newGoalData)
                    .select();
        
                if (insertError) {
                    console.error("Erro ao adicionar meta:", insertError);
                    setFormError(insertError.message); // Set form-specific error
                } else if (data && data.length > 0) {
                    // Assuming Supabase returns the newly inserted goal
                    const addedGoal: Goal = {
                        id: data[0].id,
                        user_id: data[0].user_id,
                        created_at: data[0].created_at,
                        name: data[0].name,
                        description: data[0].description,
                        recurrence: data[0].recurrence,
                        days_of_week: data[0].days_of_week || undefined,
                        target_value: data[0].target_value || undefined,
                        progress: [], // Initialize empty progress
                    };
                    setGoals(prev => [...prev, addedGoal]);
                    setGoalName("");
                    setGoalDescription("");
                    setRecurrence('daily');
                    setSelectedDaysOfWeek([]);
                    setOpenAddGoalDialog(false); // Close dialog on success
                }
                setLoading(false);
            };
        const toggleDailyGoalCompletion = (goalId: string, date: Date) => {
            setGoals(goals.map(goal => {
                if (goal.id === goalId) {
                    const dateString = format(date, 'yyyy-MM-dd');
                    const existingProgressIndex = goal.progress.findIndex(p => p.date === dateString);
    
                    if (existingProgressIndex !== -1) {
                        // Update existing progress
                        const updatedProgress = [...goal.progress];
                        updatedProgress[existingProgressIndex] = {
                            ...updatedProgress[existingProgressIndex],
                            completed: !updatedProgress[existingProgressIndex].completed,
                        };
                        return { ...goal, progress: updatedProgress };
                    } else {
                        // Add new progress for this date
                        return {
                            ...goal,
                            progress: [...goal.progress, { date: dateString, completed: true }],
                        };
                    }
                }
                return goal;
            }));
        };
    
        const getGoalProgressForDate = (goal: Goal, date: Date) => {
            const dateString = format(date, 'yyyy-MM-dd');
            return goal.progress.find(p => p.date === dateString);
        };
    
        // Create a map of goals by date for the calendar view
        const goalsByDateMap = useMemo(() => {
            const map: Record<string, Goal[]> = {};
            const firstDayOfMonth = startOfMonth(displayMonth); // Use displayMonth
            const lastDayOfMonth = endOfMonth(displayMonth); // Use displayMonth

            // Pre-fill the map with empty arrays for all days in the display month
            getDatesBetween(firstDayOfMonth, lastDayOfMonth).forEach(date => {
                map[format(date, 'yyyy-MM-dd')] = [];
            });

            goals.forEach(goal => {
                // Iterate over the days of the current month being displayed
                getDatesBetween(firstDayOfMonth, lastDayOfMonth).forEach(date => {
                    const dateString = format(date, 'yyyy-MM-dd');
                    const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday

                    let shouldAddGoal = false;
                    if (goal.recurrence === 'daily') {
                        shouldAddGoal = true;
                    } else if (goal.recurrence === 'weekly' && goal.days_of_week?.includes(dayOfWeek)) {
                        shouldAddGoal = true;
                    } else if (goal.recurrence === 'once') {
                        // For 'once' goals, check if the goal's created_at date is the same as the current date
                        const goalCreatedAtDate = parseISO(goal.created_at);
                        if (isSameDay(goalCreatedAtDate, date)) {
                            shouldAddGoal = true;
                        }
                    }
                    // TODO: Add logic for monthly goals (e.g., if goal.created_at.getDate() === date.getDate())

                    if (shouldAddGoal) {
                        if (!map[dateString]) {
                            map[dateString] = [];
                        }
                        map[dateString].push(goal);
                    }
                });
            });
            return map;
        }, [goals, displayMonth]); // Add displayMonth to dependencies
    
        const filteredGoals = useMemo(() => {
            if (!selectedDate) return [];
            const dayOfWeek = selectedDate.getDay(); // 0 for Sunday, 6 for Saturday
    
            return goals.filter(goal => {
                if (goal.recurrence === 'daily') {
                    return true;
                }
                if (goal.recurrence === 'weekly' && goal.days_of_week?.includes(dayOfWeek)) {
                    return true;
                }
                // Add logic for monthly/once later if needed
                return false;
            });
        }, [goals, selectedDate]);
    
        const weekDays = [
            { label: "Dom", value: 0 },
            { label: "Seg", value: 1 },
            { label: "Ter", value: 2 },
            { label: "Qua", value: 3 },
            { label: "Qui", value: 4 },
            { label: "Sex", value: 5 },
            { label: "Sáb", value: 6 },
        ];
    
            if (loading) {
                return <div className="min-h-screen flex items-center justify-center">Carregando metas...</div>;
            }
        
            if (error) {
                return <div className="min-h-screen flex items-center justify-center text-red-500">Erro: {error}</div>;
            }
        
            return (
                <div className="space-y-6">                <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Metas</h2>
                <p className="text-muted-foreground">Defina e acompanhe suas metas de vida.</p>
    
                <div className="flex justify-end mb-4">
                    <Dialog open={openAddGoalDialog} onOpenChange={setOpenAddGoalDialog}>
                        <DialogTrigger asChild>
                            <Button>Adicionar Nova Meta</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Adicionar Nova Meta</DialogTitle>
                                <DialogDescription>
                                    Preencha os detalhes para adicionar uma nova meta.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="goalName">Nome da Meta</Label>
                                    <Input
                                        id="goalName"
                                        type="text"
                                        placeholder="Ex: Aprender Next.js"
                                        value={goalName}
                                        onChange={(e) => setGoalName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="goalDescription">Descrição</Label>
                                    <Input
                                        id="goalDescription"
                                        type="text"
                                        placeholder="Ex: Completar um projeto full-stack"
                                        value={goalDescription}
                                        onChange={(e) => setGoalDescription(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="recurrence">Recorrência</Label>
                                    <Select value={recurrence} onValueChange={(value: Goal['recurrence']) => setRecurrence(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione a recorrência" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Diária</SelectItem>
                                            <SelectItem value="weekly">Semanal</SelectItem>
                                            <SelectItem value="monthly">Mensal</SelectItem>
                                            <SelectItem value="once">Única</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
    
                                {recurrence === 'weekly' && (
                                    <div className="grid gap-2">
                                        <Label>Dias da Semana</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {weekDays.map(day => (
                                                <div key={day.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`day-${day.value}`}
                                                        checked={selectedDaysOfWeek.includes(day.value)}
                                                        onCheckedChange={() => handleDayToggle(day.value)}
                                                    />
                                                    <label
                                                        htmlFor={`day-${day.value}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {day.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
        
                                {formError && <p className="text-sm text-red-500">{formError}</p>}
                                <Button onClick={addGoal} className="bg-primary text-primary-foreground hover:bg-primary/90">Adicionar Meta</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Progresso Diário</CardTitle>
                        <CardDescription className="text-muted-foreground">Selecione uma data para ver e marcar suas metas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                month={displayMonth} // Pass displayMonth to Calendar
                                onMonthChange={setDisplayMonth} // Update displayMonth when month changes in Calendar
                                className="rounded-md border shadow"
                                captionLayout="dropdown"
                                fromYear={2020}
                                toYear={2030}
                                locale={ptBR}
                                weekStartsOn={0}
                                goalsByDate={goalsByDateMap}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {selectedDate && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">
                            Metas para {format(selectedDate, 'PPP', { locale: ptBR })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredGoals.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredGoals.map((goal) => {
                                    const progress = getGoalProgressForDate(goal, selectedDate);
                                    const isCompleted = progress ? progress.completed : false;
                                    return (
                                        <li key={goal.id} className="flex items-center gap-3 border-b border-border py-2 last:border-b-0">
                                            <Checkbox
                                                id={`goal-${goal.id}-${format(selectedDate, 'yyyy-MM-dd')}`}
                                                checked={isCompleted}
                                                onCheckedChange={() => toggleDailyGoalCompletion(goal.id, selectedDate)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor={`goal-${goal.id}-${format(selectedDate, 'yyyy-MM-dd')}`}
                                                    className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
                                                >
                                                    {goal.name}
                                                </label>
                                                <p className="text-sm text-muted-foreground">{goal.description}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <CardDescription className="text-muted-foreground">Nenhuma meta para este dia.</CardDescription>
                        )}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Todas as Metas</CardTitle>
                    <CardDescription className="text-muted-foreground">Gerencie todas as suas metas cadastradas.</CardDescription>
                </CardHeader>
                <CardContent>
                    {goals.length > 0 ? (
                        <ul className="space-y-4">
                            {goals.map((goal) => (
                                <li key={goal.id} className="flex flex-col gap-2 border-b border-border py-2 last:border-b-0">
                                    <div className="flex items-center justify-between">
                                        <div className="grid gap-1.5 leading-none">
                                            <p className="text-sm font-medium text-foreground">{goal.name}</p>
                                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                                            <p className="text-xs text-muted-foreground">Recorrência: {translateRecurrence(goal.recurrence)}</p>
                                            {goal.recurrence === 'weekly' && (
                                                <p className="text-xs text-muted-foreground">Dias: {formatDaysOfWeek(goal.days_of_week)}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => alert("Funcionalidade de edição em breve!")}>
                                                Editar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteGoal(goal.id)}>
                                                Apagar
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <CardDescription className="text-muted-foreground">Nenhuma meta cadastrada ainda.</CardDescription>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
