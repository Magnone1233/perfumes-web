import styled, { css } from "styled-components";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp" | "cart";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: ButtonVariant;
  height?: number;
  radius?: number;
  horizontalPadding?: number;
  maxWidth?: number;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.colors.textPrimary};
    color: ${({ theme }) => theme.colors.bgPrimary};
    border: none;

    &:hover:not(:disabled) {
      background: #e7ddd0;
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.card};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.elevated};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.textPrimary};
      border-color: ${({ theme }) => theme.colors.border};
    }
  `,
  whatsapp: css`
    background: ${({ theme }) => theme.colors.whatsapp};
    color: ${({ theme }) => theme.colors.bgPrimary};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.whatsapp};

    &:hover:not(:disabled) {
      filter: brightness(0.94);
    }
  `,
  cart: css`
    background: ${({ theme }) => theme.colors.textPrimary};
    color: ${({ theme }) => theme.colors.bgPrimary};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accentSoft};
    }
  `,
};

const StyledButton = styled.button<
  Required<
    Pick<
      ButtonProps,
      "variant" | "height" | "radius" | "horizontalPadding" | "fullWidth"
    >
  > &
    Pick<ButtonProps, "maxWidth">
>`
  min-height: ${({ height }) => `${height}px`};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "unset")};
  padding: 0 ${({ horizontalPadding }) => `${horizontalPadding}px`};
  border-radius: ${({ radius }) => `${radius}px`};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    filter 0.2s ease;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  ${({ variant }) => variantStyles[variant]}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Button = ({
  title,
  variant = "primary",
  type = "button",
  height = 48,
  radius = 14,
  horizontalPadding = 22,
  fullWidth = false,
  maxWidth,
  ...rest
}: ButtonProps) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      height={height}
      radius={radius}
      horizontalPadding={horizontalPadding}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      {...rest}
    >
      {title}
    </StyledButton>
  );
};
