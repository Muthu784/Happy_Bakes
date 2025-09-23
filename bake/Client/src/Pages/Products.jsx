import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../Styles/Products.css';
import BakeryItemCard from '../Components/bakeryitemcards';

const Products = () => {
  const [bakeryItems, setBakeryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    console.log('Current user in Products:', user);
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setBakeryItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  const handleAddToCart = (item) => {
    navigate('/user-orders', { state: { orderedItem: { ...item, quantity: 1 } } });
  };

  if (loading) {
    return (
      <div className="products-container">
        <h1>Loading products...</h1>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1>Hello{user ? ` ${user.name}` : ''}, Welcome to our delightful bakery selection</h1>
      <div className="bakery-items-grid">
        {bakeryItems.map((item) => (
          <BakeryItemCard key={item._id} item={item} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default Products;
