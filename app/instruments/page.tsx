import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("instruments")
        .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        return <pre>Erro: {error.message}</pre>;
    }

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function Instruments() {
    return (
        <Suspense fallback={<div>Loading instruments...</div>}>
            <InstrumentsData />
        </Suspense>
    );
}
