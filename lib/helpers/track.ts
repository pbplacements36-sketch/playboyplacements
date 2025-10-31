import { GA_TRACKING_ID } from '@/components/GoogleAnalytics'

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window.gtag !== 'function') {
    return
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}