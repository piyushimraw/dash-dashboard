import { useQuery } from "@tanstack/react-query";
import {
  getRentedVehicleList,
  getRentedVehicleListWithCorruptData,
} from "./api";
import { queryKeys } from "@packages/api-client";

type UseGetRentedVehicleListParams = {
  showCorruptData?: boolean;
  queryParams?: Record<string, string | number>;
};

export const useGetRentedVehicleList = ({
  showCorruptData = false,
  queryParams,
}: UseGetRentedVehicleListParams = {}) =>
  useQuery({
    queryKey: [
      ...queryKeys.rentedVehicles.all,
      { showCorruptData, ...(queryParams ?? {}) },
    ],
    queryFn: () =>
      showCorruptData
        ? getRentedVehicleListWithCorruptData()
        : getRentedVehicleList(queryParams),

    // Uncomment when you want to test error handling / caching behavior
    // throwOnError: true,
    // staleTime: 0,
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
    // gcTime: 0
  });
