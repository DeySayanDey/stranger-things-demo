import React from 'react';
import './SplitText.css';

const SplitText = ({ children, active }) => {
  if (typeof children !== 'string') return children;

  return (
    <span className="split-text-wrapper">
      {children.split('').map((char, index) => (
        <span
          key={index}
          className={`char ${active ? 'rotated' : ''}`}
          style={{ transitionDelay: `${index * 15}ms` }} // Staggered rotation effect
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default SplitText;