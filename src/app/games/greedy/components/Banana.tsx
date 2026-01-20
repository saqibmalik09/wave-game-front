//Banana.tsx file
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Banana: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/590/590764.png"
    multiplier="x5"
    imageScale={0.34}
  />
);
export default Banana;
