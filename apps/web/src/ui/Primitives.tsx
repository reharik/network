// src/ui/primitives.tsx
import styled, { css } from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  padding: ${({ theme }) => theme.spacing(2)};
`;

export const HStack = styled.div<{ gap?: number; wrap?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ gap = 2, theme }) => theme.spacing(gap)};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
`;

export const VStack = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 2, theme }) => theme.spacing(gap)};
`;

export const Spacer = styled.div`
  flex: 1 1 auto;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.subtext};
`;

const baseInput = css`
  width: 100%;
  padding: 10px 12px;
  background: #0c0f15;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.sm};
  outline: none;
  transition:
    border 120ms ease,
    box-shadow 120ms ease;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(124, 156, 255, 0.15);
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.subtext};
  }
`;

export const Input = styled.input`
  ${baseInput}
`;
export const Select = styled.select`
  ${baseInput}
`;
export const TextArea = styled.textarea`
  ${baseInput};
  resize: vertical;
  min-height: 80px;
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}>`
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ size = 'md' }) => (size === 'sm' ? '8px 10px' : '10px 14px')};
  cursor: pointer;
  font-weight: 600;

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: transparent;
          color: ${theme.colors.text};
          border-color: ${theme.colors.border};
          &:hover {
            background: #0c0f15;
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.subtext};
          &:hover {
            color: ${theme.colors.text};
            background: #0c0f15;
          }
        `;
      case 'danger':
        return css`
          background: ${theme.colors.danger};
          color: #0b0b0b;
          &:hover {
            filter: brightness(0.95);
          }
        `;
      default:
        return css`
          background: ${theme.colors.accent};
          color: #0b0b0b;
          &:hover {
            background: ${theme.colors.accentHover};
          }
        `;
    }
  }}
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #0c1220;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 12px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  th {
    color: ${({ theme }) => theme.colors.subtext};
    font-weight: 600;
  }
  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
`;

export const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <VStack gap={1}>
    <Label>{label}</Label>
    {children}
  </VStack>
);
