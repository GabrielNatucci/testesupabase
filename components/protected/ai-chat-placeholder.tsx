"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AiChatPlaceholder() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Chat com IA (Em Breve)</h2>
            <p className="text-muted-foreground">Aqui você poderá interagir com nossa IA para obter insights financeiros, dicas e assistência personalizada.</p>

            <Card className="text-center p-6">
                <CardHeader>
                    <CardTitle className="text-primary">Funcionalidade Futura</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-muted-foreground">
                        Estamos trabalhando duro para trazer essa funcionalidade inovadora para você!
                        Prepare-se para uma experiência de gerenciamento financeiro ainda mais inteligente.
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
    );
}
