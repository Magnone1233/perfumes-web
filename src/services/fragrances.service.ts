import { apiClient } from "./api.client";
import type { Fragrance } from "../types/fragrance";

export const getFragrances = (signal?: AbortSignal) =>
  apiClient.get<Fragrance[]>("/fragrances", signal);

export interface FragranceFormValues {
  name: string;
  description: string;
  price: string;
  promotionalPrice: string;
  stock: string;
  imageFile: File | null;
}

const buildAdminHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const buildFragranceFormData = (
  values: FragranceFormValues,
  includeAllFields: boolean,
) => {
  const payload = new FormData();

  if (includeAllFields || values.name.trim().length > 0) {
    payload.append("name", values.name.trim());
  }

  if (includeAllFields || values.description.trim().length > 0) {
    payload.append("description", values.description.trim());
  }

  if (includeAllFields || values.price.trim().length > 0) {
    payload.append("price", values.price.trim());
  }

  if (includeAllFields || values.promotionalPrice.trim().length > 0) {
    payload.append("promotionalPrice", values.promotionalPrice.trim());
  }

  if (includeAllFields || values.stock.trim().length > 0) {
    payload.append("stock", values.stock.trim());
  }

  if (values.imageFile) {
    payload.append("image", values.imageFile);
  }

  return payload;
};

export const createFragrance = (values: FragranceFormValues, token: string) =>
  apiClient.post<Fragrance>(
    "/fragrances",
    buildFragranceFormData(values, true),
    buildAdminHeaders(token),
  );

export const updateFragrance = (
  fragranceId: number,
  values: FragranceFormValues,
  token: string,
) =>
  apiClient.patch<Fragrance>(
    `/fragrances/${fragranceId}`,
    buildFragranceFormData(values, false),
    buildAdminHeaders(token),
  );

export const deleteFragrance = (fragranceId: number, token: string) =>
  apiClient.delete<{ message: string }>(
    `/fragrances/${fragranceId}`,
    buildAdminHeaders(token),
  );
