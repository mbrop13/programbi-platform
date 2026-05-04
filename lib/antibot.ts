/**
 * Anti-bot utilities for client-side forms.
 * - Honeypot: hidden field that bots fill but humans never see.
 * - Timestamp: records when the form was loaded to detect instant submissions.
 */

/** Returns anti-bot payload fields to merge into every fetch body */
export function getAntiBotFields(formLoadedAt: number, honeypotValue: string) {
  return {
    _t: formLoadedAt,            // timestamp when form was loaded
    _website: honeypotValue,     // honeypot — should always be empty for real users
  };
}

/** Inline styles to hide the honeypot field accessibly (still in DOM but invisible) */
export const honeypotStyle: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  top: "-9999px",
  opacity: 0,
  height: 0,
  width: 0,
  overflow: "hidden",
};
