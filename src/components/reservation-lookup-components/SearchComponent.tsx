import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface Props {
  search?: string;
  setSearch: (v: string) => void;
}
export default function SearchComponent({ setSearch, search }: Props) {
  const handleSearch = (value: string) => {
    setSearch(value);
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
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
