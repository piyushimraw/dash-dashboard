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
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        <Search className="h-4 w-4" aria-hidden="true" />
      </div>
      <input
        type="text"
        placeholder="Customer name / email / phone"
        onChange={handleSearch}
        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
