import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import endpoints from "../constants/endpoints.json";
import { NetworkInterfaceSchema } from "shared";

const QUERY_KEY = "interfaces";

export const useNetworkInterfaces = () =>
  useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const resp = await fetch(endpoints.getNetworkInterfaces);
      const body = await resp.json();
      const page = z.array(NetworkInterfaceSchema).parse(body);
      return page;
    },
    staleTime: Infinity,
  });
