export interface Fragrance {
  id: number;
  name: string;
  description: string | null;
  price: number;
  promotionalPrice: number | null;
  stock: number;
  image: string | null;
}
