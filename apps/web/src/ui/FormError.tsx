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

const ErrorList = styled.ul`
  margin: 0;
  padding: 0 0 0 16px;
  list-style: disc;

  li {
    margin: 4px 0;
  }

  li:first-child {
    margin-top: 0;
  }

  li:last-child {
    margin-bottom: 0;
  }
`;

/**
 * A reusable component for displaying general form errors
 */
export const FormError = ({ errors = [] }: { errors: BaseApiError[] }): JSX.Element | null => {
  if (errors.length === 0) {
    return null;
  }
  // Extract message from each error object
  const messages = errors.map((e) => (typeof e === 'string' ? e : e.message));

  // Single error - no list needed
  if (messages.length === 1) {
    return <ErrorContainer>{messages[0]}</ErrorContainer>;
  }

  // Multiple errors - show as list
  return (
    <ErrorContainer>
      <ErrorList>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ErrorList>
    </ErrorContainer>
  );
};
