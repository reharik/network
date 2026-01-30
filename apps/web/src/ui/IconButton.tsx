import React from 'react';
import styled from 'styled-components';

const sizes = { md: 32, sm: 22 } as const;

const IconButtonBase = styled.button<{
  $variant?: 'secondary' | 'ghost' | 'danger';
  $size?: keyof typeof sizes;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size = 'md' }) => sizes[$size]}px;
  height: ${({ $size = 'md' }) => sizes[$size]}px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.subtext};
  background: transparent;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(255, 255, 255, 0.06);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant, theme }) =>
    $variant === 'danger' &&
    `
    color: ${theme.colors.danger};
    &:hover:not(:disabled) {
      background: rgba(220, 38, 38, 0.15);
    }
  `}
`;

type IconButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'secondary' | 'ghost' | 'danger';
  size?: keyof typeof sizes;
  'aria-label': string;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, size, ...rest }, ref) => (
    <IconButtonBase ref={ref} $variant={variant} $size={size} {...rest} />
  ),
);
IconButton.displayName = 'IconButton';

const iconSize = 16;

export const PlusIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const TrashIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const PauseIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const PlayIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/** Add to list / Contact Now */
export const CalendarPlusIcon = () => (
  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </svg>
);
