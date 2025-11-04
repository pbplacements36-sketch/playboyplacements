import FloatingCTAs from "@/components/FloatingCTAs";
import React from "react";
import { Toaster } from "react-hot-toast";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
       <main className="root">
            <Toaster position="top-center" />
                {children}
            <FloatingCTAs />
        </main>

    )
}