import React from "react";
import { Button } from "@/components/ui/button";

type State = {
  hasError: boolean;
  error?: Error | null;
};

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // send to any logging endpoint; keep minimal for now
    console.error("Uncaught error:", error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="container my-20 p-6 rounded-lg bg-destructive/10 border border-destructive">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred. You can try to reload or report this.</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => window.location.reload()}>Reload</Button>
            <Button variant="outline" onClick={this.reset}>Close</Button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
