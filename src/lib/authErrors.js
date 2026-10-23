const BY_CODE = {
    INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password. Check your details and try again.",
    USER_ALREADY_EXISTS: "An account with this email already exists. Try signing in instead.",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with this email already exists. Try signing in instead.",
    PASSWORD_TOO_SHORT: "Your password must be at least 8 characters.",
    PASSWORD_TOO_LONG: "That password is too long.",
    INVALID_EMAIL: "Enter a valid email address.",
    EMAIL_NOT_VERIFIED: "Please verify your email address before signing in.",
    PROVIDER_NOT_FOUND: "Google sign-in is not set up on this server yet.",
    SOCIAL_ACCOUNT_ALREADY_LINKED: "This Google account is already linked to another user.",
    ACCOUNT_NOT_FOUND: "No account found with these details.",
};

/** Turns a Better Auth error object (or a thrown network error) into a specific, user-facing sentence. */
export function authErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    if (!error) return fallback;
    if (BY_CODE[error.code]) return BY_CODE[error.code];
    if (error.code === "BANNED_USER" || /banned|blocked/i.test(error.message || "")) {
        return "This account has been blocked. Contact support if you think this is a mistake.";
    }
    if (error.status === 429) return "Too many attempts. Please wait a few minutes and try again.";
    if (error.status >= 500) return "The server had a problem. Please try again in a moment.";
    if (error instanceof TypeError || error.status === 0 || /failed to fetch|network/i.test(error.message || "")) {
        return "Cannot reach the server. Check your connection and try again.";
    }
    return error.message || fallback;
}

export function googleErrorMessage(code) {
    if (!code) return null;
    if (/access_denied|cancel/i.test(code)) return "Google sign-in was cancelled.";
    if (/banned|blocked/i.test(code)) return "This account has been blocked.";
    return "Google sign-in failed. Please try again, or use your email and password.";
}
