"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar"; // Import Calendar component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { format,} from "date-fns"; // Import date utilities
import { ptBR } from 'date-fns/locale'; // Import locale for pt-BR

// Define Goal type
interface Goal {
    id: number;
    name: string;
    description: string;
    recurrence: 'daily' | 'weekly' | 'monthly' | 'once';
    daysOfWeek?: number[]; // 0 for Sunday, 1 for Monday, etc.
    targetValue?: number; // e.g., 3 for "drink 3L of water"
    progress: { date: string, value?: number, completed: boolean }[];
}

export function GoalsManagement() {
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");
    const [recurrence, setRecurrence] = useState<Goal['recurrence']>('daily');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Initialize with undefined

    // Use useEffect to set selectedDate after component mounts
    useEffect(() => {
        setSelectedDate(new Date());
    }, []);

    const [goals, setGoals] = useState<Goal[]>([]); // Initialize with empty array

    useEffect(() => {
        setSelectedDate(new Date());

        // Populate goals with dummy data after component mounts (client-side)
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const dummyGoals: Goal[] = [
            {
                id: 1,
                name: "Ir à academia",
                description: "Três vezes por semana",
                recurrence: 'weekly',
                daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
                progress: [
                    { date: format(today, 'yyyy-MM-dd'), completed: true },
                    { date: format(tomorrow, 'yyyy-MM-dd'), completed: false },
                ]
            },
            {
                id: 2,
                name: "Beber 3L de água",
                description: "Todos os dias",
                recurrence: 'daily',
                targetValue: 3,
                progress: [
                    { date: format(today, 'yyyy-MM-dd'), completed: true, value: 3 },
                    { date: format(tomorrow, 'yyyy-MM-dd'), completed: false, value: 1 },
                ]
            },
            {
                id: 3,
                name: "Ler 'Hábitos Atômicos'",
                description: "Ler 20 páginas",
                recurrence: 'daily',
                progress: [
                    { date: format(today, 'yyyy-MM-dd'), completed: false },
                ]
            }
        ];
        setGoals(dummyGoals);
    }, []);

    const addGoal = () => {
        if (goalName && goalDescription) {
            const newGoal: Goal = {
                id: goals.length + 1,
                name: goalName,
                description: goalDescription,
                recurrence: recurrence,
                progress: [],
            };
            // Add initial progress for today if daily goal
            if (recurrence === 'daily') {
                newGoal.progress.push({ date: format(new Date(), 'yyyy-MM-dd'), completed: false });
            }
            setGoals([...goals, newGoal]);
            setGoalName("");
            setGoalDescription("");
            setRecurrence('daily');
        }
    };

    const toggleDailyGoalCompletion = (goalId: number, date: Date) => {
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

    const filteredGoals = useMemo(() => {
        if (!selectedDate) return [];
        const dayOfWeek = selectedDate.getDay(); // 0 for Sunday, 6 for Saturday

        return goals.filter(goal => {
            if (goal.recurrence === 'daily') {
                return true;
            }
            if (goal.recurrence === 'weekly' && goal.daysOfWeek?.includes(dayOfWeek)) {
                return true;
            }
            // Add logic for monthly/once later if needed
            return false;
        });
    }, [goals, selectedDate]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Metas</h2>
            <p className="text-muted-foreground">Defina e acompanhe suas metas de vida.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Adicionar Nova Meta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
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
                            <Button onClick={addGoal} className="bg-primary text-primary-foreground hover:bg-primary/90">Adicionar Meta</Button>
                        </div>
                    </CardContent>
                </Card>

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
                                className="rounded-md border shadow"
                                captionLayout="dropdown" // Add dropdown for month/year selection
                                fromYear={2020}
                                toYear={2030}
                                locale={ptBR} // Set locale to Portuguese
                                weekStartsOn={0} // Start week on Sunday
                                defaultMonth={selectedDate || new Date(2024, 0, 1)} // Explicitly set defaultMonth
                                today={selectedDate || new Date(2024, 0, 1)} // Explicitly set today
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
        </div>
    );
}
