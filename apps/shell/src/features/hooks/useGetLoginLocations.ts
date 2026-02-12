import { useQuery } from '@tanstack/react-query';

import { getLoginLocations } from '../login-location/api/getLoginLocation';

export const useGetLoginLocations = () =>
  useQuery({
    queryKey: ['login-locations'],
    queryFn: getLoginLocations,
    throwOnError: false,
  });
