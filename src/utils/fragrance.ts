import { API_CONFIG } from "../config/api.config";
import type { Fragrance } from "../types/fragrance";

const WHATSAPP_BASE_URL = "https://wa.me";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const getFragranceFinalPrice = (fragrance: Fragrance) => {
  const promotionalPrice = fragrance.promotionalPrice;

  if (promotionalPrice !== null && promotionalPrice < fragrance.price) {
    return promotionalPrice;
  }

  return fragrance.price;
};

export const resolveFragranceImage = (image: string | null) => {
  if (!image) {
    return null;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const normalizedBase = API_CONFIG.BASE_URL.replace(/\/$/, "");
  const normalizedPath = image.startsWith("/") ? image : `/${image}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const buildWhatsAppUrl = (fragrance: Fragrance, rawPhone?: string) => {
  const message = encodeURIComponent(
    `Hola! Quiero consultar por ${fragrance.name} (${formatCurrency(fragrance.promotionalPrice ?? fragrance.price)}).`,
  );

  const phone = (rawPhone ?? "").replace(/\D/g, "");
  if (!phone) {
    return `${WHATSAPP_BASE_URL}/?text=${message}`;
  }

  return `${WHATSAPP_BASE_URL}/${phone}?text=${message}`;
};

interface CartWhatsAppItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export const buildCartWhatsAppUrl = (
  items: CartWhatsAppItem[],
  rawPhone?: string,
) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const detailLines = items.map((item) => {
    const subtotal = item.unitPrice * item.quantity;
    return `- ${item.name} x${item.quantity} | ${formatCurrency(item.unitPrice)} c/u | Subtotal: ${formatCurrency(subtotal)}`;
  });

  const message = encodeURIComponent(
    [
      "Hola! Quiero hacer este pedido:",
      "",
      ...detailLines,
      "",
      `Cantidad total de productos: ${totalItems}`,
      `Total final: ${formatCurrency(totalAmount)}`,
    ].join("\n"),
  );

  const phone = (rawPhone ?? "").replace(/\D/g, "");
  if (!phone) {
    return `${WHATSAPP_BASE_URL}/?text=${message}`;
  }

  return `${WHATSAPP_BASE_URL}/${phone}?text=${message}`;
};
