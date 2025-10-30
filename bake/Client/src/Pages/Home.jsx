import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../Styles/Home.css';

const Home = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const productImages = {
    'cakes': [
      { id: 'cake1', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', title: 'Chocolate Cake' },
      { id: 'cake2', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729', title: 'Vanilla Cake' },
      { id: 'cake3', url: 'https://plus.unsplash.com/premium_photo-1714342967585-fc96cb3db818?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJlZCUyMHZlbHZldCUyMGNha2V8ZW58MHx8MHx8fDA%3D', title: 'Red Velvet Cake' },
    ],
    'cookies': [
      { id: 'cookie1', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e', title: 'Chocolate Chip' },
      { id: 'cookie2', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35', title: 'Butter Cookies' },
      { id: 'cookie3', url: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a', title: 'Oatmeal Cookies' },
    ],
    'breads': [
      { id: 'bread1', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', title: 'Sourdough' },
      { id: 'bread2', url: 'https://media.istockphoto.com/id/1163707527/photo/breads-assortment-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=bwXxE5tX22xgtr2ji5x56QrUWWJYbbTTJI9Zu_-hEqs=', title: 'Artisan Bread' },
      { id: 'bread3', url: 'https://media.istockphoto.com/id/1223423223/photo/wholegrain-and-seeds-sliced-bread.webp?a=1&b=1&s=612x612&w=0&k=20&c=evsZ9jGvQk57zoyVelmRVe1VyzK_gjSjZ0Ho8ls9x0w=', title: 'Multigrain Bread' },
    ],
    'pastries': [
      { id: 'pastry1', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b', title: 'Donuts' },
      { id: 'pastry2', url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51', title: 'Croissants' },
      { id: 'pastry3', url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729', title: 'Danish Pastries' },
    ],
  };

  useEffect(() => {
    if (user) {
      console.log('Current user in Home:', user.name);
    }
  }, [user]);

  const handleSpecialtyClick = (category) => {
    setSelectedCategory(category);
    const productSection = document.getElementById('gallery');
    productSection.scrollIntoView({ behavior: 'smooth' });
  };

  

  return (
    <div>
      <motion.div
        className="home-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="home-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Welcome to Happy Bakes{user ? `, ${user.name}` : ''}
        </motion.h1>
        <motion.p
          className="home-subtitle"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Discover our delicious treats – where every bite feels like home!
        </motion.p>

        <p className="home-description">
          At Happy Bakes, we believe that the best memories are made over a delicious slice of cake or a warm, freshly baked pastry.
          Whether you're celebrating a special occasion or simply treating yourself, we're here to make your day a little sweeter.
        </p>

        <motion.div
          className="home-cta"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 120 }}
        >
          <Link to="/products" className="cta-button">
            View Our Products
          </Link>
        </motion.div>
      </motion.div>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          Happy Bakes is a family-owned bakery bringing you joy through homemade treats baked with love. 
          We focus on using locally sourced ingredients and traditional recipes passed down for generations.
        </p>
      </section>

      {/* Specialties Section */}
      <section id="menu" className="specialties-section">
        <h2>Our Specialties</h2>
        <div className="specialties-grid">
          <div className="specialty-card" onClick={() => handleSpecialtyClick('cakes')}>🎂 Signature Cakes</div>
          <div className="specialty-card" onClick={() => handleSpecialtyClick('cookies')}>🍪 Soft Cookies</div>
          <div className="specialty-card" onClick={() => handleSpecialtyClick('breads')}>🍞 Fresh Breads</div>
          <div className="specialty-card" onClick={() => handleSpecialtyClick('pastries')}>🍩 Donuts & Pastries</div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section id="gallery" className="product-section">
        <h2>Products Gallery</h2>
        <div className="product-carousel">
          {selectedCategory === 'all' ? (
            Object.values(productImages).flat().map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.url} alt={product.title} />
                <h3>{product.title}</h3>
              </div>
            ))
          ) : (
            productImages[selectedCategory].map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.url} alt={product.title} />
                <h3>{product.title}</h3>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="contact" className="testimonial-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonial">
          <p>"Absolutely the best brownies I've ever had! My kids ask for Happy Bakes every weekend."</p>
          <span>- Priya, Chennai</span>
        </div>
        <div className="testimonial">
          <p>"The birthday cake was stunning and delicious. Everyone loved it!"</p>
          <span>- Rahul, Bangalore</span>
        </div>
      </section>

      {/* Order Online Section (Optional) */}
      <section id="order"></section>
    </div>
  );
};

export default Home;
