"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function GoalsManagement() {
    const [goalName, setGoalName] = useState("");
    const [goalDescription, setGoalDescription] = useState("");
    const [goals, setGoals] = useState([
        { id: 1, name: "Ir à academia", description: "Três vezes por semana", completed: false },
        { id: 2, name: "Ler um livro", description: "Terminar 'Hábitos Atômicos'", completed: false },
    ]);

    const addGoal = () => {
        if (goalName && goalDescription) {
            setGoals([...goals, { id: goals.length + 1, name: goalName, description: goalDescription, completed: false }]);
            setGoalName("");
            setGoalDescription("");
        }
    };

    const toggleGoalCompletion = (id: number) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, completed: !goal.completed } : goal
        ));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Gerenciamento de Metas</h2>
            <p className="text-muted-foreground">Defina e acompanhe suas metas de vida.</p>

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
                        <Button onClick={addGoal} className="bg-primary text-primary-foreground hover:bg-primary/90">Adicionar Meta</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary">Minhas Metas</CardTitle>
                </CardHeader>
                <CardContent>
                    {goals.length > 0 ? (
                        <ul className="space-y-2">
                            {goals.map((goal) => (
                                <li key={goal.id} className="flex items-center gap-3 border-b border-border py-2 last:border-b-0">
                                    <Checkbox
                                        id={`goal-${goal.id}`}
                                        checked={goal.completed}
                                        onCheckedChange={() => toggleGoalCompletion(goal.id)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor={`goal-${goal.id}`}
                                            className={`text-sm font-medium ${goal.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                                        >
                                            {goal.name}
                                        </label>
                                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <CardDescription className="text-muted-foreground">Nenhuma meta definida ainda.</CardDescription>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
