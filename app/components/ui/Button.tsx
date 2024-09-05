import {ReactNode} from 'react';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

interface ButtonProps {
  children: ReactNode;
  onClick?: any;
  type?: ButtonType;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: any;
}

const sizeClasses = {
  small: 'py-1 px-2 text-sm',
  medium: 'py-2 px-4 text-base',
  large: 'py-3 px-6 text-lg',
};

const variantClasses = {
  primary:
    'bg-primary hover:bg-primary/75 text-black font-semibold transition-all',
  secondary:
    'bg-secondary hover:bg-secondary/75 text-gray-50 font-semibold transition-all',
  danger:
    'bg-red-600 hover:bg-red-800 text-gray-50 font-semibold transition-all',
  outline:
    'border border-secondary text-secondary hover:bg-gray-50/20 transition-all',
  ghost: 'text-50 bg-none hover:bg-gray-50/20 transition-all',
};

export const Button = ({
  children,
  onClick,
  type = 'button',
  size = 'medium',
  variant = 'primary',
  className = '',
  disabled,
  name,
  value,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      name={name}
      value={value}
      className={`flex items-center justify-center rounded  ${
        sizeClasses[size as ButtonSize]
      } ${variantClasses[variant as ButtonVariant]} ${className}
      ${
        disabled
          ? 'opacity-70 hover:cursor-not-allowed'
          : 'hover:cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
};
