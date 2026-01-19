import { useQuery } from "@tanstack/react-query";
import { getRentedVehicleList } from "./api";
import { queryKeys } from "@dash/shared-state";

export const useGetRentedVehicleList = () =>
  useQuery({
    queryKey: queryKeys.rentedVehicles.all,
    queryFn: getRentedVehicleList,
  });
