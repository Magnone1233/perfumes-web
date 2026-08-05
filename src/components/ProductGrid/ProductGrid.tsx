import styled from "styled-components";
import type { Fragrance } from "../../types/fragrance";
import { ProductCard } from "../ProductCard/ProductCard";

interface ProductGridProps {
  fragrances: Fragrance[];
  onAddToCart: (fragrance: Fragrance) => void;
  minCardWidth?: number;
}

const Grid = styled.div<{ minCardWidth: number }>`
  display: grid;
  width: 100%;
  gap: 24px;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ minCardWidth }) => `${minCardWidth}px`}, 1fr)
  );
`;

export const ProductGrid = ({
  fragrances,
  onAddToCart,
  minCardWidth = 260,
}: ProductGridProps) => {
  return (
    <Grid minCardWidth={minCardWidth}>
      {fragrances.map((fragrance) => (
        <ProductCard
          key={fragrance.id}
          fragrance={fragrance}
          onAddToCart={onAddToCart}
        />
      ))}
    </Grid>
  );
};
