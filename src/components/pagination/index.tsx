import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, isLoading }) => (
  <div className="flex justify-between items-center mt-6">
    <Button
      variant="outline"
      disabled={page === 1 || isLoading}
      onClick={() => onPageChange(page - 1)}
      className="text-primary border-primary hover:bg-primary/10"
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      Previous
    </Button>
    <span className="text-sm text-gray-600">
      Page {page} of {totalPages}
    </span>
    <Button
      variant="outline"
      disabled={page === totalPages || isLoading}
      onClick={() => onPageChange(page + 1)}
      className="text-primary border-primary hover:bg-primary/10"
    >
      Next
      <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);
