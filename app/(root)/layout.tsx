import React from "react";
import { Toaster } from "react-hot-toast";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <main className="root">
            {/* <Header session={session} /> */}
            <Toaster position="top-center" />
            {children}
            
        </main>

    )
}