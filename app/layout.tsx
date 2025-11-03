import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { LocationProvider } from "@/hooks/useLocation";
import LocationGate from "@/components/LocationGate";
import ProgressBar from "@/components/ProgressBar";
import { Suspense } from "react";

// import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Playboy Placements",
  description: "Playboy Placement Services, is a premier placement agency for escorts, models, and entertainers. We specialize in connecting high-end talent with exclusive clients worldwide. Our services include personalized matchmaking, event staffing, and VIP companionship. With a focus on discretion and professionalism, we ensure that both our clients and talent have exceptional experiences. Whether you're seeking a sophisticated companion for a special occasion or looking to join our elite roster of talent, Playboy Placement Services is your trusted partner in the world of luxury entertainment.",
};

export default async function RootLayout({ children, }: { children: React.ReactNode; }) {

  // const session = await auth();

  return (
    <html lang="en">
        <head>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0PN0MGRBMV"></Script>
          <Script id="google-analytics">
            {
              `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0PN0MGRBMV');
              `
            }
          </Script>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        
        </head>
        <body
          className="antialiased"
        >
          <Toaster position="top-center" />
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          <LocationProvider>
          <LocationGate>
            {/* Your main app content, navbars, etc. go here */}
            {children}
          </LocationGate>
        </LocationProvider>
        </body>
    </html>
  );
}
