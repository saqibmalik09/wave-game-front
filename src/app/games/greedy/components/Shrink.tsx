// Shrink.tsx
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Shrink: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/782/782934.png"
    multiplier="x15"
    imageScale={0.34}
  />
);

export default Shrink;