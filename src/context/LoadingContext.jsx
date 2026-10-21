import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    // কাউন্টার ব্যবহার করে লোডিং ট্র্যাক করা হচ্ছে
    const [loadingCount, setLoadingCount] = useState(0);
    const [loadingText, setLoadingText] = useState("Loading...");

    const startLoading = useCallback((text = "Loading...") => {
        setLoadingText(text);
        setLoadingCount((prev) => prev + 1);
    }, []);

    const stopLoading = useCallback(() => {
        setLoadingCount((prev) => Math.max(0, prev - 1));
    }, []);

    const loading = loadingCount > 0;

    // useMemo-তে শুধু ফাংশন এবং লোডিং স্টেট রাখা হয়েছে
    const value = useMemo(
        () => ({
            loading,
            loadingText,
            startLoading,
            stopLoading,
        }),
        [loading, loadingText, startLoading, stopLoading]
    );

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useGlobalLoading = () => {
    const context = useContext(LoadingContext);

    if (!context) {
        throw new Error(
            "useGlobalLoading must be used inside LoadingProvider"
        );
    }

    return context;
};