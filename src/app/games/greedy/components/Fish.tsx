// Fish.tsx file
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Fish: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/782/782930.png"
    multiplier="x25"
    imageScale={0.34}
  />
);

export default Fish;
