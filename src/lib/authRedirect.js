const KEY = "shopsphere_post_login";

export const dashboardFor = (role) => (String(role).toLowerCase() === "admin" ? "/admin/dashboard" : "/user/dashboard");

/** Only same-site paths, never the auth pages themselves (prevents open redirects and loops). */
export function safePath(path) {
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return null;
    if (/^\/(login|register|auth\/)/.test(path)) return null;
    return path;
}

/** Where a signed-in user should land: the page they asked for, if their role may open it, else their dashboard. */
export function resolveDestination(role, wanted) {
    const isAdmin = String(role).toLowerCase() === "admin";
    const path = safePath(wanted);
    if (!path) return dashboardFor(role);
    if (path.startsWith("/admin") && !isAdmin) return dashboardFor(role);
    if (path.startsWith("/user") && isAdmin) return dashboardFor(role);
    return path;
}

// Survives the round trip to Google (full page redirect), so the original page is not lost.
export function rememberDestination(path) {
    try {
        sessionStorage.setItem(KEY, safePath(path) || "");
    } catch {
        // storage unavailable: the user simply lands on their dashboard
    }
}

export function recallDestination() {
    try {
        return sessionStorage.getItem(KEY) || null;
    } catch {
        return null;
    }
}

export const locationPath = (loc) => (loc?.pathname ? `${loc.pathname}${loc.search || ""}` : null);
