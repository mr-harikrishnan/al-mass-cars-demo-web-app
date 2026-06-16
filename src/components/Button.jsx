import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyle = variant === 'primary' ? 'gold-btn-primary' : 'gold-btn-secondary';
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyle} ${className} flex items-center justify-center gap-2`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Please Wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
export default Button;
