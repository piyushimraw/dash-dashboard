import { Button, Input, useIsDesktop } from '@packages/ui';
import { Search, X } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';

interface Props {
  search?: string;
  setSearch: (v: string) => void;
}

export function SearchComponent({ setSearch, search = '' }: Props) {
  const isDesktop = useIsDesktop();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClear = () => {
    setSearch('');
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  // Desktop: Always show full input
  if (isDesktop) {
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
          value={search}
          className="pl-10 w-full"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 h-7 w-7 p-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // Mobile: Expandable search
  if (!isExpanded) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleExpand}
        className="h-11 w-11 shrink-0"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="relative flex-1 flex items-center animate-in fade-in slide-in-from-right-5 duration-200">
      <Search
        className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <Input
        type="text"
        placeholder="Customer name / email / phone"
        onChange={handleSearch}
        value={search}
        className="pl-10 pr-10 w-full"
        autoFocus
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClear}
        className="absolute right-1 h-7 w-7 p-0"
        aria-label="Clear search"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
