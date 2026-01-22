import { Search } from "lucide-react";
import type { ChangeEvent } from "react";
import { Input } from "@packages/ui";

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
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <Input
        type="text"
        placeholder="Customer name / email / phone"
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
}
