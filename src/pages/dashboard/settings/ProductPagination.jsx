
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
    currentPage,
    setCurrentPage,
    totalPages,
    totalResults,
    itemsPerPage,
}) {
    if (totalResults === 0) return null;

    const startResult = (currentPage - 1) * itemsPerPage + 1;
    const endResult = Math.min(
        currentPage * itemsPerPage,
        totalResults
    );

    const buttonClass =
        "inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#22332a] dark:bg-[#0d1411] dark:text-gray-300";

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-[#22332a] dark:bg-[#121816] sm:flex-row sm:px-6">
            <p className="text-xs text-gray-500">
                Showing <strong>{startResult}</strong> to{" "}
                <strong>{endResult}</strong> of{" "}
                <strong>{totalResults}</strong> products
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        setCurrentPage((p) => Math.max(p - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={buttonClass}
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                        <button
                            type="button"
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`h-8 w-8 rounded-lg text-xs font-bold ${currentPage === page
                                    ? "bg-[#10B981] text-white"
                                    : "border border-gray-200 text-gray-600 dark:border-[#22332a] dark:text-gray-300"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={buttonClass}
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
