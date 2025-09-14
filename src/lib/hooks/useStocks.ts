import { stockApi } from "@/services/stockApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// 🔹 List stocks
export const useStocks = (skip = 0, limit = 10, tradeCode?: string) => {
  return useQuery({
    queryKey: ["stocks", skip, limit, tradeCode],
    queryFn: () => stockApi.getStocks(skip, limit, tradeCode),
  });
};

// export const useStocks = (tradeCode?: string) => {
//   return useInfiniteQuery(
//     ["stocks", tradeCode],
//     ({ pageParam = 0 }) => stockApi.getStocks(pageParam, 100, tradeCode),
//     {
//       getNextPageParam: (lastPage) => {
//         if (!lastPage || lastPage.length < 100) return undefined;
//         return lastPage[lastPage.length - 1].id; // next last_id
//       },
//       keepPreviousData: false, // tradeCode change এ পুরনো data রাখবে না
//       staleTime: 1000 * 60 * 5, // 5 মিনিট
//     }
//   );
// };

// 🔹 Get single stock
export const useStock = (id: number) => {
  return useQuery({
    queryKey: ["stock", id],
    queryFn: () => stockApi.getStockById(id),
    enabled: !!id,
  });
};

// 🔹 List trade codes
export const useTradeCodes = () => {
  return useQuery({
    queryKey: ["tradeCodes"],
    queryFn: stockApi.getTradeCodes,
  });
};

// 🔹 Create stock
export const useCreateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockApi.createStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
};

// 🔹 Update stock
export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stock }: { id: number; stock }) =>
      stockApi.updateStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
};

// 🔹 Delete stock
export const useDeleteStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockApi.deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
};
