# Accessibility & User Experience Improvements


## Keyboard Accessibility
- Ensure all interactive elements (modals, buttons, cards, number pad) are reachable and operable via keyboard (Tab, Enter, Space, Arrow keys).
- Provide visible focus indicators for all focusable elements.
- Restore focus to the previously focused element when closing modals.

## ARIA & Screen Reader Support
- Add ARIA roles (e.g., `role="dialog"`, `role="button"`) and labels (`aria-label`, `aria-labelledby`, `aria-describedby`) to all custom components.
- Use `aria-live` regions for dynamic feedback (e.g., guess results, error messages, game status changes).
- Provide sr-only text for important visual feedback (e.g., correct/incorrect guess indicators).

## Reduced Motion & Visual Accessibility
- Respect user `prefers-reduced-motion` settings for transitions and animations in dialogs and overlays.
- Ensure color contrast meets WCAG AA standards for text and interactive elements.
- Avoid using color alone to convey information (add icons, text, or patterns).

## Additional Recommendations
- Test with screen readers (NVDA, VoiceOver) and keyboard-only navigation.
- Add skip-to-content links for faster navigation.
- Document accessibility features in the README for contributors.
