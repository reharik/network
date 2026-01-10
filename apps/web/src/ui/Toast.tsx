import styled, { keyframes } from 'styled-components';
import { useToast } from '../contexts/ToastContext';

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} $type={toast.type} onClick={() => dismissToast(toast.id)}>
          <Icon $type={toast.type}>{getIcon(toast.type)}</Icon>
          <Message>{toast.message}</Message>
          <CloseButton onClick={() => dismissToast(toast.id)}>×</CloseButton>
        </ToastItem>
      ))}
    </Container>
  );
};

const getIcon = (type: 'success' | 'error' | 'info'): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '!';
    case 'info':
      return 'i';
  }
};

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const ToastItem = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid
    ${({ theme, $type }) =>
      $type === 'success'
        ? theme.colors.ok
        : $type === 'error'
          ? theme.colors.danger
          : theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  min-width: 280px;
  max-width: 420px;
  pointer-events: auto;
  cursor: pointer;
  animation:
    ${slideIn} 0.3s ease-out,
    ${fadeOut} 0.3s ease-in 3.7s forwards;

  &:hover {
    filter: brightness(1.05);
  }
`;

const Icon = styled.span<{ $type: 'success' | 'error' | 'info' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  background: ${({ theme, $type }) =>
    $type === 'success'
      ? theme.colors.ok
      : $type === 'error'
        ? theme.colors.danger
        : theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
`;

const Message = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.6;

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.text};
  }
`;
