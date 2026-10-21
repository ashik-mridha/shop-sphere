import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-12 flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22332a] bg-[#121816] text-gray-300 transition hover:border-[#10B981] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
            >
                <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                    <button
                        key={pageNumber}
                        type="button"
                        onClick={() => onPageChange(pageNumber)}
                        className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${currentPage === pageNumber
                                ? "bg-[#10B981] text-white shadow-md"
                                : "border border-[#22332a] bg-[#121816] text-gray-400 hover:border-[#10B981] hover:text-white"
                            }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#22332a] bg-[#121816] text-gray-300 transition hover:border-[#10B981] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}