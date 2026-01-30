import { useQuery } from "@tanstack/react-query";
import { getRentedVehicleList } from "./api";
import { queryKeys, handleQueryError } from "@packages/api-client";

export const useGetRentedVehicleList = () =>
  useQuery({
    queryKey: queryKeys.rentedVehicles.all,
    queryFn: getRentedVehicleList,

    //uncomment to test local query error handling and removing caching
    // throwOnError: true,
    // staleTime: 0,
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
    // gcTime: 0
  });

// export const useUser = (id: string) =>
//   useQuery({
//     queryKey: queryKeys.users.detail(id),
//     queryFn: () => getUserById(id),
//     enabled: !!id,
//   });
