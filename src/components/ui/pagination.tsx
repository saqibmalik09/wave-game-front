import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const renderPageBase = (page: number) => (
        <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
                "h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all",
                currentPage === page
                    ? "bg-primary text-primary-foreground shadow-sm scale-110"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
        >
            {page}
        </button>
    )

    const renderEllipsis = (key: string) => (
        <div key={key} className="h-8 w-8 flex items-center justify-center text-muted-foreground">
            <MoreHorizontal className="w-4 h-4" />
        </div>
    )

    const renderPageNumbers = () => {
        const pages = []
        const showMax = 5

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(renderPageBase(i))
            }
        } else {
            // Always show first page
            pages.push(renderPageBase(1))

            if (currentPage > 3) {
                pages.push(renderEllipsis('start-ellipsis'))
            }

            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            if (currentPage <= 3) {
                end = 4
            }

            if (currentPage >= totalPages - 2) {
                start = totalPages - 3
            }

            for (let i = start; i <= end; i++) {
                pages.push(renderPageBase(i))
            }

            if (currentPage < totalPages - 2) {
                pages.push(renderEllipsis('end-ellipsis'))
            }

            // Always show last page
            pages.push(renderPageBase(totalPages))
        }

        return pages
    }

    return (
        <div className="flex items-center justify-between px-2 py-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground hidden sm:block">
                Showing page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "h-8 px-3 flex items-center justify-center rounded-lg border border-input bg-background/50 hover:bg-accent text-muted-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        currentPage !== 1 && "hover:border-primary/50 hover:text-foreground"
                    )}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 mx-2">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "h-8 px-3 flex items-center justify-center rounded-lg border border-input bg-background/50 hover:bg-accent text-muted-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        currentPage !== totalPages && "hover:border-primary/50 hover:text-foreground"
                    )}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
