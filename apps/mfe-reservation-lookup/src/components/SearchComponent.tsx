import { Input } from "@packages/ui";
import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

interface Props {
  search?: string;
  setSearch: (v: string) => void;
}

export function SearchComponent({ setSearch }: Props) {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div className="relative flex-1">
      <span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </span>
      <Input
        type="text"
        placeholder="Customer name / email / phone"
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
}
