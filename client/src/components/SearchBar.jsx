import { useState, useEffect } from "react";

const SearchBar = ({ onSearch, initialValue = "" }) => {
  const [searchText, setSearchText] = useState(initialValue);

  useEffect(() => {
    setSearchText(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-powder-blue">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for gigs by title..."
              value={searchText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full px-5 py-3 pl-12 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-royal-blue opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="bg-powder-blue text-royal-blue px-8 py-3 rounded-lg font-semibold hover:bg-bone transition-all duration-200 cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
