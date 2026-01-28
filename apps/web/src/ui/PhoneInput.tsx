import React from 'react';
import type { BaseApiError } from '../types/ApiResult';
import { formatPhoneForDisplay, MAX_PHONE_DISPLAY_LENGTH, stripToDigits } from '../utils/phoneMask';
import { FormInput } from './FormInput';

type PhoneInputProps = {
  label?: string;
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  errors?: BaseApiError[];
};

/**
 * Phone input with intelligent masking.
 * Displays (XXX) XXX-XXXX for US, +1 (XXX) XXX-XXXX for US with country code,
 * or +X XXX XXX XXXX for international. Parent receives the formatted string on change.
 */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, ...rest }, ref) => {
    const displayValue = formatPhoneForDisplay(value ?? '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = stripToDigits(e.target.value);
      const formatted = formatPhoneForDisplay(digits);
      // Create a synthetic event so parent's onChange still receives an event-like object
      const synthetic = {
        ...e,
        target: { ...e.target, value: formatted },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(synthetic);
    };

    return (
      <FormInput
        ref={ref}
        type="tel"
        autoComplete="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={rest.placeholder ?? '+1 (555) 123-4567'}
        {...rest}
        maxLength={MAX_PHONE_DISPLAY_LENGTH}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
