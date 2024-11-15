import { getBusServices } from "@/lib/constants/apis";
import { ServiceNo, BusStop } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export type BusServicesProps = {
    data: ServiceNo[];
    isLoading: boolean;
    error: Error | null;
};

const useBusServicesSearch = (selectedBusStop: BusStop | undefined) => {
    const { data: response, isLoading, error } = useQuery({
        queryKey: ["busServices", selectedBusStop?.BusStopCode],
        queryFn: () => getBusServices(selectedBusStop?.BusStopCode ?? ""),
        enabled: !!selectedBusStop,
    });

    return {
        data: response?.data ?? [],
        isLoading,
        error
    };
}

export default useBusServicesSearch;
