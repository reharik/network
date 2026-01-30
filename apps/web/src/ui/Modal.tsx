import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Button, Card } from './Primitives';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return undefined;

  const modalContent = (
    <Overlay onClick={handleOverlayClick} onKeyDown={handleKeyDown} tabIndex={-1}>
      <ModalCard>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton variant="ghost" onClick={onClose}>
            ×
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalCard>
    </Overlay>
  );

  return createPortal(modalContent, document.body);
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
    align-items: flex-start;
    overflow-y: auto;
  }
`;

const ModalCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled(Button)`
  padding: 8px;
  min-width: auto;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
