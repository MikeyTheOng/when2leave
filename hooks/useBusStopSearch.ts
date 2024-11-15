import { getBusStops } from "@/lib/constants/apis";
import { BusStop } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export type SearchInputProps = {
    search: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    data: BusStop[];
    isLoading: boolean;
    error: Error | null;
};

const useBusStopSearch = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);

        return () => clearTimeout(timer);
    }, [search]);

    const { data: response, isLoading, error } = useQuery({
        queryKey: ["busStops", debouncedSearch],
        queryFn: () => getBusStops(debouncedSearch),
        enabled: !!debouncedSearch,
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return {
        search,
        handleSearch,
        data: response?.data ?? [],
        isLoading,
        error
    };
}

export default useBusStopSearch;