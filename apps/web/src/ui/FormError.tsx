import { JSX } from 'react';
import styled from 'styled-components';
import { BaseApiError } from '../types/ApiResult';

const ErrorContainer = styled.div`
  color: ${({ theme }) => theme.colors.danger || '#dc2626'};
  padding: 12px;
  background-color: rgba(220, 38, 38, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
`;

/**
 * A reusable component for displaying general form errors
 */
export const FormError = ({ errors = [] }: { errors: BaseApiError[] }): JSX.Element | null => {
  if (errors.length === 0) {
    return null;
  }
  return <ErrorContainer>{errors.join(', ')}</ErrorContainer>;
};
