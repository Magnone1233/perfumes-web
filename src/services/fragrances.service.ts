import { apiClient } from "./api.client";
import type { Fragrance } from "../types/fragrance";

export const getFragrances = (signal?: AbortSignal) =>
  apiClient.get<Fragrance[]>("/fragrances", signal);
