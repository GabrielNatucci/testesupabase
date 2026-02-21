import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function EnvVarWarning() {
    return (
        <div className="flex gap-4 items-center">
            <Badge variant={"outline"} className="font-normal">
                Necessário configurar variáveis de ambiente do Supabase
            </Badge>
            <div className="flex gap-2">
                <Button size="sm" variant={"outline"} disabled>
                    Entrar
                </Button>
                <Button size="sm" variant={"default"} disabled>
                    Inscrever-se
                </Button>
            </div>
        </div>
    );
}
