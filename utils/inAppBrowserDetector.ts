'use client';

export const isInAppBrowser = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    return false; // Not in a browser environment
  }

  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;

  // Common patterns for in-app browsers
  const inAppBrowserPatterns = [
    /FBAN/i, // Facebook
    /FBAV/i, // Facebook
    /Instagram/i,
    /Line/i,
    /Pinterest/i,
    /Snapchat/i,
    /Twitter/i,
    /Viber/i,
    /WeChat/i,
    /QQ/i,
    /Telegram/i, // Telegram's in-app browser
    /wv/i, // WebView (common for Android in-app browsers)
    /Safari/i, // Safari can be an in-app browser on iOS if not the main Safari app
    /CriOS/i, // Chrome on iOS (can be in-app)
    /EdgiOS/i, // Edge on iOS (can be in-app)
    /FirefoxiOS/i, // Firefox on iOS (can be in-app)
  ];

  // Check for specific patterns that indicate a full browser, to avoid false positives
  const fullBrowserExclusions = [
    /Chrome/i, // Exclude full Chrome browser
    /Safari/i, // Exclude full Safari browser (will be caught by other patterns if in-app)
    /Firefox/i, // Exclude full Firefox browser
    /Edge/i, // Exclude full Edge browser
  ];

  const isFullBrowser = fullBrowserExclusions.some(pattern => userAgent.match(pattern));

  // If it matches an in-app pattern AND is NOT a known full browser, consider it an in-app browser
  const isLikelyInApp = inAppBrowserPatterns.some(pattern => userAgent.match(pattern));

  // Refined logic: If it matches an in-app pattern AND doesn't explicitly look like a full browser
  // This is a heuristic, not foolproof, but covers common cases.
  return isLikelyInApp && !isFullBrowser;
};

// Helper to attempt opening in an external browser
export const openInExternalBrowser = (url: string) => {
  try {
    // Attempt to open in a new tab/window. In many in-app browsers, this will
    // prompt the user to open in their default external browser.
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      // Fallback for pop-up blockers or very restrictive environments
      window.location.href = url;
    }
  } catch (e) {
    console.error("Failed to open in external browser:", e);
    window.location.href = url; // Final fallback
  }
};