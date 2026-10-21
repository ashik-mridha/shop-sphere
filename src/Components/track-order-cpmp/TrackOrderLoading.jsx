
import { LoaderCircle } from "lucide-react";

export default function TrackOrderLoading() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <LoaderCircle
                className="animate-spin text-emerald-600"
                size={42}
            />

            <p className="text-sm text-gray-500">
                Loading order tracking...
            </p>
        </div>
    );
}
