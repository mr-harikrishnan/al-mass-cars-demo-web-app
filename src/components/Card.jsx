import React from 'react';

export const Card = ({ children, className = '', hoverEffect = true, ...props }) => {
  return (
    <div
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
