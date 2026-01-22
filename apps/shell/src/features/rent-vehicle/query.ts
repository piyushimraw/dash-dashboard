import { useQuery } from "@tanstack/react-query";
import { getRentedVehicleList } from "./api";
import { queryKeys } from "@packages/api-client";

export const useGetRentedVehicleList = () =>
  useQuery({
    queryKey: queryKeys.rentedVehicles.all,
    queryFn: getRentedVehicleList,
  });

// export const useUser = (id: string) =>
//   useQuery({
//     queryKey: queryKeys.users.detail(id),
//     queryFn: () => getUserById(id),
//     enabled: !!id,
//   });
