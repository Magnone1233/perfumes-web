import styled from "styled-components";
import type { AppTheme } from "../../styles/theme";

type Surface = "card" | "elevated" | "transparent";

interface ContainerProps {
  padding?: number;
  radius?: number;
  surface?: Surface;
}

const surfaceMap: Record<Surface, keyof AppTheme["colors"]> = {
  card: "card",
  elevated: "elevated",
  transparent: "bgSecondary",
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding: ${({ padding = 20 }) => `${padding}px`};
  border-radius: ${({ radius = 18 }) => `${radius}px`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, surface = "card" }) =>
    theme.colors[surfaceMap[surface]]};
`;
