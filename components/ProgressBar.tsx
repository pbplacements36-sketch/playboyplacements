'use client';

import NProgress from 'nprogress';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Import NProgress styles (you might need to create this file or link to a CDN)
// For now, we'll assume you'll add it to your global style.less or a dedicated CSS file.
// import 'nprogress/nprogress.css'; // You'll need to create/import this CSS

const ProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false }); // Hide the default spinner if you prefer your own

    // Start NProgress when navigation begins
    NProgress.start();

    // End NProgress when navigation completes
    // This effect will run on every route change (pathname or searchParams change)
    // and will stop the progress bar.
    NProgress.done();

    // Cleanup function (optional, but good practice)
    return () => {
      NProgress.done();
    };
  }, [pathname, searchParams]); // Re-run effect when pathname or searchParams change

  return null; // This component doesn't render anything visible itself
};

export default ProgressBar;