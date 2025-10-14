export const logError = (error: unknown, context?: Record<string, unknown>) => {
  // Minimal logger - replace with Sentry/LogRocket or server endpoint as needed
  try {
    const payload = {
      time: new Date().toISOString(),
      error: typeof error === 'object' ? JSON.stringify(error) : String(error),
      context: context ?? {},
    };
  console.error('[app][error]', payload);
  } catch (e) {
  console.error('[app][error] failed to serialize error', e);
  }
};

export default logError;
