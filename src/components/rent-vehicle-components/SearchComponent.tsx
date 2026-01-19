import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface props {
  search: string;
  setSearch: (v: string) => void;
}
export default function SearchComponent({ search, setSearch }: props) {
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
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
