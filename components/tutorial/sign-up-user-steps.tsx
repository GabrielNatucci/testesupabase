import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { ArrowUpRight } from "lucide-react";

export function SignUpUserSteps() {
    return (
        <ol className="flex flex-col gap-6">
            {process.env.VERCEL_ENV === "preview" ||
                process.env.VERCEL_ENV === "production" ? (
                <TutorialStep title="Configurar URLs de redirecionamento">
                    <p>Parece que este aplicativo está hospedado no Vercel.</p>
                    <p className="mt-4">
                        Esta implantação em particular é
                        <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                            &quot;{process.env.VERCEL_ENV}&quot;
                        </span>{" "}
                        em
                        <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                            https://{process.env.VERCEL_URL}
                        </span>
                        .
                    </p>
                    <p className="mt-4">
                        Você precisará{" "}
                        <Link
                            className="text-primary hover:text-foreground"
                            href={
                                "https://supabase.com/dashboard/project/_/auth/url-configuration"
                            }
                        >
                            atualizar seu projeto Supabase
                        </Link>{" "}
                        com URLs de redirecionamento baseadas nas URLs de implantação do Vercel.
                    </p>
                    <ul className="mt-4">
                        <li>
                            -{" "}
                            <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                                http://localhost:3000/**
                            </span>
                        </li>
                        <li>
                            -{" "}
                            <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/**`}
                            </span>
                        </li>
                        <li>
                            -{" "}
                            <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
                                    ".vercel.app",
                                    "",
                                )}-*-[vercel-team-url].vercel.app/**`}
                            </span>{" "}
                            (A URL da Equipe Vercel pode ser encontrada em{" "}
                            <Link
                                className="text-primary hover:text-foreground"
                                href="https://vercel.com/docs/accounts/create-a-team#find-your-team-id"
                                target="_blank"
                            >
                                Configurações da Equipe Vercel
                            </Link>
                            )
                        </li>
                    </ul>
                    <Link
                        href="https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls"
                        target="_blank"
                        className="text-primary/50 hover:text-primary flex items-center text-sm gap-1 mt-4"
                    >
                        Documentos de URLs de redirecionamento <ArrowUpRight size={14} />
                    </Link>
                </TutorialStep>
            ) : null}
            <TutorialStep title="Cadastre seu primeiro usuário">
                <p>
                    Vá para a{" "}
                    <Link
                        href="auth/sign-up"
                        className="font-bold hover:underline text-foreground/80"
                    >
                        página de Cadastro
                    </Link>{" "}
                    e cadastre seu primeiro usuário. Não tem problema se for apenas você por enquanto. Sua ideia incrível terá muitos usuários depois!
                </p>
            </TutorialStep>
        </ol>
    );
}
