import { Component } from "react";

export default class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (!this.state.error) return this.props.children;
        return (
            <div role="alert" className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="mt-2 text-sm text-muted">An unexpected error occurred. Reloading the page usually fixes it.</p>
                <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg">
                        Reload page
                    </button>
                    <a href="/" className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold">Go home</a>
                </div>
            </div>
        );
    }
}
