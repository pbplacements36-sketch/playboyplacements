import React from "react";
import {Toaster} from "@/components/ui/sonner";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <main className="root">
            {/* <Header session={session} /> */}
            {children}
            <Toaster richColors theme="light" closeButton />
        </main>

    )
}