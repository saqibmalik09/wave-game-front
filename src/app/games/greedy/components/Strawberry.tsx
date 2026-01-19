// Strawberry.tsx
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Strawberry: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/590/590772.png"
    multiplier="x5"
    imageScale={0.34}
  />
);

export default Strawberry;