import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components";
import { useDebounce } from "@/hooks";


interface SearchBarProps {
    onUserSearchValue: React.Dispatch<React.SetStateAction<string>>,
};


const SearchBar = ({ onUserSearchValue }: SearchBarProps) => {

    const [searchValue, setSearchValue] = useState('');

    const debouncedSearchValue = useDebounce(searchValue, 500);

    useEffect(() => {
        onUserSearchValue(debouncedSearchValue);
    }, [debouncedSearchValue]);

    return (
        <div className='flex items-center px-4 @xl:px-10 @2xl:px-15 @3xl:px-20 py-8 bg-white w-full h-10 border-b border-b-secondary-100 relative'>
            <Input onChange={(e) => setSearchValue(e.target.value)} type="text" id="search" placeholder="Search voltex for creators..." className="w-full! rounded-full! pl-11 bg-neutral-50 focus:bg-white placeholder:text-sm placeholder:text-neutral-400 focus:placeholder:text-neutral-500 focus:shadow-md transition-shadow duration-200" />
            <Search color="gray" className="absolute left-6 @xl:left-12 @2xl:left-17.5 @3xl:left-22 xl:left-53" />
        </div>
    )
};

export default SearchBar;