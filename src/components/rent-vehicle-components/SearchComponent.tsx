import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}
export default function SearchComponent({ search, setSearch }: Props) {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
