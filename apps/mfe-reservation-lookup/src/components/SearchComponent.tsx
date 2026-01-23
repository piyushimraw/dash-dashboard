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
    <div className="relative flex-1 flex items-center">
      <Search
        className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        type="text"
        placeholder="Customer name / email / phone"
        onChange={handleSearch}
        className="pl-10 w-full"
      />
    </div>
  );
}
