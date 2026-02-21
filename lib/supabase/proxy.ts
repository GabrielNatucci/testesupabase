import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Se as variáveis de ambiente não estiverem configuradas, ignore a verificação de proxy. Você pode remover isso depois de configurar o projeto.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Com Fluid compute, não coloque este cliente em uma variável de ambiente
  // global. Sempre crie um novo a cada requisição.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Não execute código entre createServerClient e
  // supabase.auth.getClaims(). Um erro simples pode tornar muito difícil depurar
  // problemas com usuários sendo desconectados aleatoriamente.

  // IMPORTANTE: Se você remover getClaims() e usar renderização no lado do servidor
  // com o cliente Supabase, seus usuários poderão ser desconectados aleatoriamente.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // sem usuário, potencialmente responda redirecionando o usuário para a página de login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: Você *deve* retornar o objeto supabaseResponse como está.
  // Se você estiver criando um novo objeto de resposta com NextResponse.next() certifique-se de:
  // 1. Passar o request nele, assim:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copiar os cookies, assim:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Alterar o objeto myNewResponse para atender às suas necessidades, mas evite alterar
  //    os cookies!
  // 4. Finalmente:
  //    return myNewResponse
  // Se isso não for feito, você pode estar fazendo com que o navegador e o servidor fiquem
  // fora de sincronia e encerre a sessão do usuário prematuramente!

  return supabaseResponse;
}
