# Error Handling & Observability Improvements

- Use a top-level ErrorBoundary to catch render errors.
- Centralize logging and prepare for integration with error reporting tools (e.g., Sentry).
- Make analytics opt-in via environment variable to avoid dev-time network errors.
