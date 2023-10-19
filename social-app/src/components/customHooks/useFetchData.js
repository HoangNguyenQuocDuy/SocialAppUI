import { useQuery } from "@tanstack/react-query";
import newRequest from "~/untils/request"
import axios from "axios";

export default function useFetchData(key, param) {
  const source = axios.CancelToken.source()

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [...key],
    queryFn: () => newRequest.get(param, {
      cancelToken: source.token
    }).then((res) => res.data.data),
    keepPreviousData: true
  });

  return [isLoading, error, data, refetch]
}
