import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@packages/api-client";
import { getRentedVehicleListUsingBff } from "../rent-vehicle/api";


export const useGetRentedVehicleListWithBff = () =>
  useQuery({
    queryKey: queryKeys.rentedVehicles.bff,
    queryFn: getRentedVehicleListUsingBff,
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
