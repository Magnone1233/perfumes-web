import styled from "styled-components";
import { Button } from "../Button/Button";
import { Container } from "../Container/Container";
import { Typography } from "../Typography/Typography";
import type { CartItem } from "../../types/cart";
import { formatCurrency } from "../../utils/fragrance";

interface CartSummaryProps {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  onIncrease: (fragranceId: number) => void;
  onDecrease: (fragranceId: number) => void;
  onRemove: (fragranceId: number) => void;
  onCheckoutWhatsApp: () => void;
}

const Wrapper = styled(Container)`
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 360px;
  overflow: auto;
  padding-right: 4px;
`;

const ItemRow = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.elevated};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QtyButton = styled.button`
  height: 28px;
  min-width: 28px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
`;

const Footer = styled.div`
  display: grid;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 14px;
`;

const EmptyBox = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 14px;
`;

export const CartSummary = ({
  items,
  totalItems,
  totalAmount,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckoutWhatsApp,
}: CartSummaryProps) => {
  return (
    <Wrapper surface="card" padding={18} radius={18}>
      <Typography as="h3" variant="sectionTitle" color="textPrimary">
        Tu Carrito
      </Typography>

      {items.length === 0 && (
        <EmptyBox>
          <Typography as="p" variant="secondary" color="textSecondary">
            Todavia no agregaste productos.
          </Typography>
        </EmptyBox>
      )}

      {items.length > 0 && (
        <ItemList>
          {items.map((item) => {
            const subtotal = item.unitPrice * item.quantity;

            return (
              <ItemRow key={item.fragrance.id}>
                <Typography as="h4" variant="productName" color="textPrimary">
                  {item.fragrance.name}
                </Typography>
                <Typography as="p" variant="secondary" color="textSecondary">
                  Precio unitario: {formatCurrency(item.unitPrice)}
                </Typography>
                <ItemMeta>
                  <QtyControls>
                    <QtyButton
                      type="button"
                      onClick={() => onDecrease(item.fragrance.id)}
                      aria-label={`Restar una unidad de ${item.fragrance.name}`}
                    >
                      -
                    </QtyButton>
                    <Typography
                      as="span"
                      variant="body"
                      color="textPrimary"
                      weight={600}
                    >
                      {item.quantity}
                    </Typography>
                    <QtyButton
                      type="button"
                      onClick={() => onIncrease(item.fragrance.id)}
                      aria-label={`Sumar una unidad de ${item.fragrance.name}`}
                    >
                      +
                    </QtyButton>
                  </QtyControls>

                  <Button
                    title="Quitar"
                    variant="ghost"
                    height={32}
                    radius={10}
                    horizontalPadding={12}
                    onClick={() => onRemove(item.fragrance.id)}
                  />
                </ItemMeta>
                <Typography
                  as="p"
                  variant="body"
                  color="textPrimary"
                  weight={600}
                >
                  Subtotal: {formatCurrency(subtotal)}
                </Typography>
              </ItemRow>
            );
          })}
        </ItemList>
      )}

      <Footer>
        <Typography as="p" variant="secondary" color="textSecondary">
          Cantidad total: {totalItems}
        </Typography>
        <Typography as="p" variant="price" color="textPrimary">
          Total: {formatCurrency(totalAmount)}
        </Typography>
      </Footer>

      <Button
        title="Enviar pedido por WhatsApp"
        variant="whatsapp"
        height={54}
        radius={16}
        fullWidth
        disabled={items.length === 0}
        onClick={onCheckoutWhatsApp}
      />
    </Wrapper>
  );
};
