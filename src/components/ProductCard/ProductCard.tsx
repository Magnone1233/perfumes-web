import styled from "styled-components";
import { Button } from "../Button/Button";
import { Container } from "../Container/Container";
import { Typography } from "../Typography/Typography";
import type { Fragrance } from "../../types/fragrance";
import { formatCurrency, resolveFragranceImage } from "../../utils/fragrance";

interface ProductCardProps {
  fragrance: Fragrance;
  onAddToCart: (fragrance: Fragrance) => void;
}

const Card = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Media = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background:
    linear-gradient(
      145deg,
      rgba(200, 169, 106, 0.18) 0%,
      rgba(27, 27, 31, 1) 60%
    ),
    ${({ theme }) => theme.colors.elevated};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const OriginalPrice = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
  font-size: 0.875rem;
`;

const StockBadge = styled.span<{ lowStock: boolean }>`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, lowStock }) =>
      lowStock ? theme.colors.warning : theme.colors.success};
  color: ${({ theme, lowStock }) =>
    lowStock ? theme.colors.warning : theme.colors.success};
  font-size: 0.75rem;
  font-weight: 600;
`;

const Actions = styled.div`
  display: grid;
  gap: 10px;
`;

export const ProductCard = ({ fragrance, onAddToCart }: ProductCardProps) => {
  const imageUrl = resolveFragranceImage(fragrance.image);
  const hasPromotion =
    fragrance.promotionalPrice !== null &&
    fragrance.promotionalPrice < fragrance.price;

  return (
    <Card surface="card" padding={18} radius={18}>
      <Media>
        {imageUrl ? (
          <ProductImage src={imageUrl} alt={fragrance.name} loading="lazy" />
        ) : (
          <MediaFallback>
            <Typography
              align="center"
              variant="secondary"
              color="textSecondary"
            >
              Imagen no disponible
            </Typography>
          </MediaFallback>
        )}
      </Media>

      <StockBadge lowStock={fragrance.stock < 5}>
        Stock: {fragrance.stock}
      </StockBadge>

      <Typography as="h3" variant="productName" color="textPrimary">
        {fragrance.name}
      </Typography>

      {fragrance.description && (
        <Typography as="p" variant="secondary" color="textSecondary">
          {fragrance.description}
        </Typography>
      )}

      <PriceRow>
        <Typography
          as="span"
          variant="price"
          color={hasPromotion ? "accent" : "textPrimary"}
        >
          {formatCurrency(
            hasPromotion
              ? (fragrance.promotionalPrice as number)
              : fragrance.price,
          )}
        </Typography>
        {hasPromotion && (
          <OriginalPrice>{formatCurrency(fragrance.price)}</OriginalPrice>
        )}
      </PriceRow>

      <Actions>
        <Button
          title="Agregar al carrito"
          variant="cart"
          height={44}
          radius={12}
          fullWidth
          onClick={() => onAddToCart(fragrance)}
        />
      </Actions>
    </Card>
  );
};
