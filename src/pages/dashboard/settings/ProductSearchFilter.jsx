
import { Search } from "lucide-react";

const CATEGORIES = [
    "all",
    "electronics",
    "fashion",
    "home",
    "sports",
];

export default function ProductSearchFilter({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
}) {
    return (
        <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#22332a] dark:bg-[#121816] sm:flex-row">
            <div className="relative w-full sm:w-80">
                <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />

                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by title..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-[#10B981] dark:border-[#22332a] dark:bg-[#0d1411] dark:text-white"
                />
            </div>

            <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
                {CATEGORIES.map((cat) => (
                    <button
                        type="button"
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition ${selectedCategory === cat
                                ? "bg-[#10B981] text-white"
                                : "border border-gray-200 bg-gray-100 text-gray-600 dark:border-[#22332a] dark:bg-[#0d1411] dark:text-gray-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
