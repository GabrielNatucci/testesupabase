import { TutorialStep } from "./tutorial-step";
import { CodeBlock } from "./code-block";

const create = `create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Next.js.'),
  ('It was awesome!');
`.trim();

const rls = `alter table notes enable row level security;
create policy "Allow public read access" on notes
for select
using (true);`.trim();

const server = `import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

const client = `'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

export function FetchDataSteps() {
    return (
        <ol className="flex flex-col gap-6">
            <TutorialStep title="Criar tabelas e inserir dados">
                <p>
                    Acesse o{" "}
                    <a
                        href="https://supabase.com/dashboard/project/_/editor"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Editor de Tabela
                    </a>{" "}
                    para seu projeto Supabase para criar uma tabela e inserir alguns dados de exemplo. Se você estiver sem criatividade, pode copiar e colar o seguinte no{" "}
                    <a
                        href="https://supabase.com/dashboard/project/_/sql/new"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Editor SQL
                    </a>{" "}
                    e clicar em EXECUTAR!
                </p>
                <CodeBlock code={create} />
            </TutorialStep>

            <TutorialStep title="Habilitar Segurança em Nível de Linha (RLS)">
                <p>
                    Supabase habilita a Segurança em Nível de Linha (RLS) por padrão. Para consultar dados da sua tabela <code>notes</code>, você precisa adicionar uma política. Você pode fazer isso no{" "}
                    <a
                        href="https://supabase.com/dashboard/project/_/editor"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Editor de Tabela
                    </a>{" "}
                    ou via{" "}
                    <a
                        href="https://supabase.com/dashboard/project/_/sql/new"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Editor SQL
                    </a>
                    .
                </p>
                <p>
                    Por exemplo, você pode executar o seguinte SQL para permitir acesso de leitura público:
                </p>
                <CodeBlock code={rls} />
                <p>
                    Você pode aprender mais sobre RLS na{" "}
                    <a
                        href="https://supabase.com/docs/guides/auth/row-level-security"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        documentação do Supabase
                    </a>
                    .
                </p>
            </TutorialStep>

            <TutorialStep title="Consultar dados do Supabase no Next.js">
                <p>
                    Para criar um cliente Supabase e consultar dados de um Componente de Servidor Assíncrono, crie um novo arquivo page.tsx em{" "}
                    <span className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium text-secondary-foreground border">
                        /app/notes/page.tsx
                    </span>{" "}
                    e adicione o seguinte.
                </p>
                <CodeBlock code={server} />
                <p>Alternativamente, você pode usar um Componente Cliente.</p>
                <CodeBlock code={client} />
            </TutorialStep>

            <TutorialStep title="Explore a Biblioteca de UI do Supabase">
                <p>
                    Acesse a{" "}
                    <a
                        href="https://supabase.com/ui"
                        className="font-bold hover:underline text-foreground/80"
                    >
                        biblioteca de UI do Supabase
                    </a>{" "}
                    e tente instalar alguns blocos. Por exemplo, você pode instalar um bloco de Chat em Tempo Real executando:
                </p>
                <CodeBlock
                    code={
                        "npx shadcn@latest add https://supabase.com/ui/r/realtime-chat-nextjs.json"
                    }
                />
            </TutorialStep>

            <TutorialStep title="Construa em um fim de semana e escale para milhões!">
                <p>Você está pronto para lançar seu produto para o mundo! 🚀</p>
            </TutorialStep>
        </ol>
    );
}
