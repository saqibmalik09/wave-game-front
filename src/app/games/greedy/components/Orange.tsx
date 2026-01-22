// Orange.tsx file
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Orange: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/590/590767.png"
    multiplier="x5"
    imageScale={0.34}
  />
);

export default Orange;