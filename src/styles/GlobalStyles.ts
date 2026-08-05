import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }

  body {
    font-family: 'Manrope', 'Inter', 'Helvetica Neue', sans-serif;
    color: ${({ theme }) => theme.colors.textPrimary};
    background:
      radial-gradient(circle at 15% -10%, rgba(200, 169, 106, 0.2) 0%, transparent 42%),
      radial-gradient(circle at 92% 8%, rgba(216, 203, 184, 0.08) 0%, transparent 35%),
      linear-gradient(180deg, ${({ theme }) => theme.colors.bgSecondary} 0%, ${({ theme }) => theme.colors.bgPrimary} 100%);
  }

  img {
    max-width: 100%;
    display: block;
  }

  button,
  input,
  textarea {
    font-family: inherit;
  }
`;
