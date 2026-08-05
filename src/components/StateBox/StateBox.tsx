import styled from "styled-components";
import { Container } from "../Container/Container";
import { Typography } from "../Typography/Typography";

interface StateBoxProps {
  title: string;
  description: string;
  isError?: boolean;
}

const Wrapper = styled(Container)<{ isError: boolean }>`
  border-color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.border};
`;

export const StateBox = ({
  title,
  description,
  isError = false,
}: StateBoxProps) => {
  return (
    <Wrapper isError={isError}>
      <Typography
        as="h3"
        variant="productName"
        color={isError ? "error" : "textPrimary"}
      >
        {title}
      </Typography>
      <Typography as="p" variant="secondary" color="textSecondary">
        {description}
      </Typography>
    </Wrapper>
  );
};
