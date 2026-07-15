import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

type SortDirection = "asc" | "desc";

function TableSortButton({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction?: SortDirection;
  onClick: () => void;
}) {
  const action = direction === "asc" ? "descending" : "ascending";
  const Icon =
    direction === "asc"
      ? ArrowUp
      : direction === "desc"
        ? ArrowDown
        : ArrowUpDown;

  return (
    <Button
      aria-label={`Sort ${label} ${action}`}
      title={`Sort ${label} ${action}`}
      variant="ghost"
      size="icon-xs"
      className={direction ? "text-foreground" : "text-muted-foreground"}
      onClick={onClick}
    >
      <Icon />
    </Button>
  );
}

export { TableSortButton };
export type { SortDirection };
