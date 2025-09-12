import type { Metadata } from "next";
import "./globals.css";

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
          {children}
        </body>
    </html>
  );
}
