// Meat.tsx
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Meat: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/590/590800.png"
    multiplier="x15"
    imageScale={0.36}
  />
);

export default Meat;