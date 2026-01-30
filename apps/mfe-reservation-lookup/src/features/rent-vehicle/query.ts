import { useQuery } from "@tanstack/react-query";
import { getRentedVehicleList, getRentedVehicleListWithCorruptData } from "./api";
import { queryKeys, handleQueryError } from "@packages/api-client";

type UseGetRentedVehicleListParams = {
  showCorruptData: boolean;
};

export const useGetRentedVehicleList = ({showCorruptData} : UseGetRentedVehicleListParams) =>
  useQuery({
    queryKey: queryKeys.rentedVehicles.all,
    queryFn: showCorruptData ? getRentedVehicleListWithCorruptData : getRentedVehicleList,

    //uncomment to test local query error handling and removing caching
    throwOnError: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    gcTime: 0
  });

// export const useUser = (id: string) =>
//   useQuery({
//     queryKey: queryKeys.users.detail(id),
//     queryFn: () => getUserById(id),
//     enabled: !!id,
//   });
