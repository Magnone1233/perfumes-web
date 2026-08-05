import styled from "styled-components";

interface PageLayoutProps {
  maxWidth?: number;
  horizontalPadding?: number;
  mobilePadding?: number;
}

interface PageSectionProps {
  gap?: number;
}

export const PageLayout = styled.main<PageLayoutProps>`
  width: 100%;
  max-width: ${({ maxWidth = 1280 }) => `${maxWidth}px`};
  margin: 0 auto;
  padding: 40px ${({ horizontalPadding = 40 }) => `${horizontalPadding}px`} 64px;
  display: flex;
  flex-direction: column;
  gap: 44px;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.mobile}px`}) {
    padding: 24px ${({ mobilePadding = 20 }) => `${mobilePadding}px`} 36px;
    gap: 30px;
  }
`;

export const PageSection = styled.section<PageSectionProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 16 }) => `${gap}px`};
`;
