import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/BakeryItemCard.css';


const BakeryItemCard = ({ item }) => {
  const Navigate = useNavigate();


  // Handle Click on the product
  const handleClick = () => {
    Navigate('/UserOrder', { state: { orderedItem: item } });
  };

  return (
    <div className="bakery-item-card">
      <img
        src={item.image} 
        alt={item.name}
        className="bakery-item-image"
      />
      <div className="bakery-item-details">
        <h3 className="bakery-item-name">{item.name}</h3>
        <p className="bakery-item-price">₹{item.price.toFixed(2)}</p>
        <button onClick={handleClick}>Order Now</button>
      </div>
    </div>
  );
};

export default BakeryItemCard;
