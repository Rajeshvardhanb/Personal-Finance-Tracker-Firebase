"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type SortBy = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

type TransactionSorterProps = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (value: SortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
};

export default function TransactionSorter({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: TransactionSorterProps) {
  return (
    <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
            <Select value={sortBy} onValueChange={(value: SortBy) => onSortByChange(value)}>
                <SelectTrigger className="w-[120px] h-9" id="sort-by">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center gap-2">
             <Label htmlFor="sort-order" className="text-sm font-medium">Order</Label>
            <Select value={sortOrder} onValueChange={(value: SortOrder) => onSortOrderChange(value)}>
                <SelectTrigger className="w-[140px] h-9" id="sort-order">
                    <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
  );
}
