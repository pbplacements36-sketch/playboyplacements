'use client'

import { usePathname } from 'next/navigation'
// This is a temporary fix for the 'gtag' property not existing on the Window object.
// In a real-world scenario, you would typically extend the Window interface globally
// or ensure that the Google Analytics script is loaded before any calls to gtag.
declare global {
  interface Window { gtag: (...args: any[]) => void; }
}
import Script from 'next/script'
import { useEffect } from 'react'

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'function') {
    return
  }
  window.gtag('config', GA_TRACKING_ID as string, {
    page_path: url,
  })
}

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_TRACKING_ID) return
    pageview(pathname)
  }, [pathname])

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}