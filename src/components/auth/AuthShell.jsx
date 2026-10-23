import Logo from "../layout/Logo";
import ThemeToggle from "../layout/ThemeToggle";

export default function AuthShell({ title, subtitle, children, footer }) {
    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <header className="flex items-center justify-between px-4 py-4 sm:px-8">
                <Logo />
                <ThemeToggle />
            </header>
            <main id="main" className="flex flex-1 items-center justify-center px-4 pb-12 pt-4">
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                        <p className="mt-2 text-sm text-muted">{subtitle}</p>
                    </div>
                    <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">{children}</div>
                    {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
                </div>
            </main>
        </div>
    );
}
