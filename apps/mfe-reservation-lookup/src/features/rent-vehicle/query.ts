import { useQuery } from "@tanstack/react-query";
import { getRentedVehicleList } from "./api";
import { queryKeys } from "@packages/api-client";

// Provide an optional `queryParams` argument and wrap the queryFn so it
// conforms to React Query's expected signature (context -> Promise<T>). This
// wrapper forwards the params to our underlying API function.
export const useGetRentedVehicleList = (queryParams?: Record<string, string | number>) =>
  useQuery({
    // Include `queryParams` in the key so results are cached per-params
    queryKey: queryParams ? [...queryKeys.rentedVehicles.all, queryParams] : queryKeys.rentedVehicles.all,
    queryFn: () => getRentedVehicleList(queryParams),
  });

// export const useUser = (id: string) =>
//   useQuery({
//     queryKey: queryKeys.users.detail(id),
//     queryFn: () => getUserById(id),
//     enabled: !!id,
//   });
