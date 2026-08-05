import styled, { css } from "styled-components";
import type { AppTheme } from "../../styles/theme";

type Variant =
  | "display"
  | "sectionTitle"
  | "productName"
  | "body"
  | "secondary"
  | "caption"
  | "price";

interface TypographyProps {
  variant?: Variant;
  color?: keyof AppTheme["colors"];
  weight?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
}

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  display: css`
    font-size: clamp(2rem, 4vw, 2.5rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.02em;
  `,
  sectionTitle: css`
    font-size: clamp(1.4rem, 2.8vw, 1.75rem);
    font-weight: 600;
    line-height: 1.2;
  `,
  productName: css`
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.2;
  `,
  body: css`
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  `,
  secondary: css`
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.45;
  `,
  caption: css`
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: 0.02em;
  `,
  price: css`
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  `,
};

export const Typography = styled.p<TypographyProps>`
  margin: 0;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "unset")};
  text-align: ${({ align = "left" }) => align};
  color: ${({ theme, color = "textPrimary" }) => theme.colors[color]};
  ${({ variant = "body" }) => variantStyles[variant]}
  ${({ weight }) =>
    weight
      ? css`
          font-weight: ${weight};
        `
      : ""}
`;
