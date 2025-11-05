import { useQuery } from "@tanstack/react-query";
import { api } from "./client";
import type { Operator, OperatorAddon } from "@/types";
import { z } from "zod";

const OperatorSchema = z.object({
  createdAt: z.string(),
  name: z.string(),
  avatar: z.string().url().or(z.string()),
  isWorking: z.boolean(),
  id: z.string(),
});

const OperatorAddonSchema = z.object({
  fieldName: z.string(),
  text: z.string(),
  isChecked: z.boolean(),
  id: z.string(),
});

export const useOperators = () => {
  return useQuery<Operator[]>({
    queryKey: ["operators"],
    queryFn: async () => {
      const { data } = await api.get("/operator");
      const parsed = z.array(OperatorSchema).safeParse(data);
      if (!parsed.success) {
        console.warn("Operator validation failed", parsed.error);
        return data as Operator[];
      }
      return parsed.data;
    },
    staleTime: 60_000,
  });
};

export const useOperatorAddons = () => {
  return useQuery<OperatorAddon[]>({
    queryKey: ["operatorAddon"],
    queryFn: async () => {
      const { data } = await api.get("/operatorAddon");
      const parsed = z.array(OperatorAddonSchema).safeParse(data);
      if (!parsed.success) {
        console.warn("OperatorAddon validation failed", parsed.error);
        return data as OperatorAddon[];
      }
      return parsed.data;
    },
    staleTime: 60_000,
  });
};
