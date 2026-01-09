import { Search as SearchIcon } from 'lucide-react';
import { useFilters } from '@hooks/useFilters';

const SearchFilter = () => {
  const { filters, searchValue, setSearchValue, handleSearch } = useFilters();

  // 엔터 키로 검색 기능 추가
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  // 검색 필드의 값이 있는지 확인
  const isSearchActive = filters.search.trim() !== '';

  return (
    <div className="flex-1 flex gap-2">
      <div className="relative flex-1 items-center">
        <input
          type="text"
          id="search"
          placeholder={isSearchActive ? filters.search : "로그 메시지 검색..."}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete='off'
          className={`w-full min-w-70 pr-9 not-focus:hover:border-muted-foreground/50 rounded-lg px-2.5 py-2 text-foreground text-sm ${isSearchActive ? 'border-primary' : ''}`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="input-button absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground hover:text-foreground"
          onClick={() => handleSearch(searchValue)}
        >
          <SearchIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;