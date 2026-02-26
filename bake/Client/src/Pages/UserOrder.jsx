import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import '../Styles/UserOrder.css';

const UserOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [orderedItems, setOrderedItems] = useState(() => {
    const savedOrders = localStorage.getItem('orderedItems');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (location.state?.orderedItem) {
      setOrderedItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.name === location.state.orderedItem.name
        );

        let updatedItems;
        if (existingItem) {
          // If item exists, don't increment quantity automatically
          return prevItems;
        } else {
          updatedItems = [
            ...prevItems,
            {
              ...location.state.orderedItem,
              quantity: 1,
              product: location.state.orderedItem.name
            }
          ];
        }

        localStorage.setItem('orderedItems', JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  }, [location.state]);

  const handleIncreaseQuantity = (index) => {
    setOrderedItems((prevItems) => {
      const updatedItems = prevItems.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('orderedItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleDecreaseQuantity = (index) => {
    setOrderedItems((prevItems) => {
      const updatedItems = prevItems.filter((item, i) => !(i === index && item.quantity === 1))
        .map((item, i) => (i === index ? { ...item, quantity: item.quantity - 1 } : item));
      localStorage.setItem('orderedItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleDeleteItem = (index) => {
    setOrderedItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      localStorage.setItem('orderedItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleOrderNow = async () => {
    if (orderedItems.length === 0) {
      console.error('No items to order.');
      return;
    }

    try {
      const orderData = {
        products: orderedItems.map(item => ({
          product: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        user: user ? user.email : null
      };

      console.log('Sending order data:', orderData);
      const response = await axios.post('http://localhost:5000/api/order/createOrder', orderData, {
        withCredentials: true
      });

      console.log('Order placed successfully:', response.data);
      setOrderPlaced(true);
      setOrderedItems([]);
      localStorage.removeItem('orderedItems');
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
    }
  };

  const totalPrice = orderedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="user-orders-container">
      <h1>Your Orders</h1>
      {orderedItems.length === 0 && !orderPlaced ? (
        <p>No orders yet. Start shopping!</p>
      ) : (
        <div className="ordered-items-list">
          {orderedItems.map((item, index) => (
            <div key={index} className="ordered-item">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price.toFixed(2)}</p>
              <div className="quantity-controls">
                <button
                  className="small-button"
                  onClick={() => handleDecreaseQuantity(index)}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="small-button"
                  onClick={() => handleIncreaseQuantity(index)}
                >
                  +
                </button>
                <button className="delete-button" onClick={() => handleDeleteItem(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {orderedItems.length > 0 && (
        <div className="order-summary">
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
          <div className="button-group">
            <button className="order-now-button" onClick={() => navigate('/payment', { state: { totalAmount: totalPrice, orderItems: orderedItems } })}>Pay with Razorpay</button>
            <button className="order-now-button order-now-button--alt" onClick={handleOrderNow}>Order Now (COD)</button>
          </div>
        </div>
      )}
      {orderPlaced && <div className="order-placed-message">Your Order is Placed!</div>}
      <button className="go-back-button" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default UserOrders;
