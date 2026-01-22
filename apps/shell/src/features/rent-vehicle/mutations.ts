    // import { useMutation, useQueryClient } from "@tanstack/react-query";
    // import { http, queryKeys } from "@packages/api-client";

    // type CreateUserPayload = {
    //   name: string;
    // };

// export const useCreateUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateUserPayload) =>
//       http("/api/users", {
//         method: "POST",
//         body: JSON.stringify(data),
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.users.all,
//       });
//     },
//   });
// };
