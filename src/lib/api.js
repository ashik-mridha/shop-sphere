import { API_URL } from "./config";

export class ApiError extends Error {
    constructor(message, status, details) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

export function withParams(path, params) {
    if (!params) return path;
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "all") qs.set(key, String(value));
    });
    const str = qs.toString();
    return str ? `${path}${path.includes("?") ? "&" : "?"}${str}` : path;
}

async function request(method, path, { body, params, signal } = {}) {
    let response;
    try {
        response = await fetch(`${API_URL}/api${withParams(path, params)}`, {
            method,
            credentials: "include",
            signal,
            headers: {
                Accept: "application/json",
                ...(body !== undefined && { "Content-Type": "application/json" }),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        if (error.name === "AbortError") throw error;
        throw new ApiError("Cannot reach the server. Check your connection and try again.", 0);
    }

    let json = null;
    try {
        json = await response.json();
    } catch {
        // empty or non-JSON body
    }

    if (!response.ok) {
        throw new ApiError(json?.message || `Request failed (${response.status})`, response.status, json?.details);
    }
    return json;
}

export const api = {
    get: (path, options) => request("GET", path, options),
    post: (path, body, options) => request("POST", path, { ...options, body: body ?? {} }),
    patch: (path, body, options) => request("PATCH", path, { ...options, body: body ?? {} }),
    del: (path, options) => request("DELETE", path, options),
};

export const errorMessage = (error, fallback = "Something went wrong. Please try again.") =>
    error instanceof ApiError || error instanceof Error ? error.message || fallback : fallback;
