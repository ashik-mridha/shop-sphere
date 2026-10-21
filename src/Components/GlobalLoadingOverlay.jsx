
import { useGlobalLoading } from "../context/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";

const GlobalLoadingOverlay = () => {
    const { loading, loadingText } = useGlobalLoading();

    if (!loading) return null;

    return (
        <LoadingSpinner fullScreen text={loadingText} />
    );
};

export default GlobalLoadingOverlay;
