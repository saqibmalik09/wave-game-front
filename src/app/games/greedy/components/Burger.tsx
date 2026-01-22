//Burger.tsx file
import React from 'react';
import ResponsiveFoodItem from './ResponsiveFoodItem';

const Burger: React.FC = () => (
  <ResponsiveFoodItem
    imageUrl="https://cdn-icons-png.flaticon.com/512/590/590803.png"
    multiplier="x15"
    imageScale={0.34}
  />
);

export default Burger;