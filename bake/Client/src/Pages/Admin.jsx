import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../Styles/Admin.css';

const Admin = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const { user } = useUser();
  const navigate = useNavigate();
  

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      // console.log('Fetching orders from:', 'http://localhost:5000/api/admin/orders'); // Debug log
      
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error details:', { 
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: { url: err.config?.url, method: err.config?.method }
      });
      
      if (err.response?.status === 401) {
        setMessage('Session expired. Please login again.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setMessage('You do not have admin privileges');
        navigate('/');
      } else {
        setMessage('Error fetching orders. Please check your connection and try again.');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to access admin panel');
        navigate('/login');
        return;
      }

      if (!user) {
        setMessage('Please login to access admin panel');
        navigate('/login');
        return;
      }

      if (!user.isAdmin || user.role !== 'admin') {
        setMessage('You do not have admin privileges');
        navigate('/');
        return;
      }

      try {
        await fetchOrders();
      } catch (error) {
        console.error('Error in checkAdminAccess:', error);
      }
    };

    checkAdminAccess();
  }, [user, navigate, fetchOrders]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (image) {
        formData.append('imageUrl', image);
      }

      await axios.post(
        'http://localhost:5000/api/admin/products',
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setMessage('Product created successfully');
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setSelectedFile(null);
      setImagePreview('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update the orders state with the new status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setMessage('Order status updated successfully');
    } catch (err) {
      console.error('Error updating order status:', err);
      setMessage(err.response?.data?.error || 'Error updating order status. Please try again.');
    }
  };

  // Get today's orders count
  const getTodayOrders = () => {
    const today = new Date().toDateString();
    return orders.filter(order => new Date(order.createdAt).toDateString() === today).length;
  };

  const DeleteOrders = async(orderId) => {
    try{
      const token = localStorage.getItem('token');
      if(!token){
        setMessage('No authentication token found. Please login again.');
        navigate('/login');
        return;
      }
      // Ask for confirmation before deleting
      const confirmed = window.confirm('Are you sure you want to delete this order?');
      if (!confirmed) return;
      // Match backend route: DELETE /api/order/deleteOrder/:id
      await axios.delete(`http://localhost:5000/api/order/deleteOrder/${orderId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
      // Optimistically remove the order from UI and show feedback
      setOrders(prev => prev.filter(o => o._id !== orderId));
      setMessage('Order deleted successfully');
    }
    catch(err){
      console.error('Error deleting order:', err);
      setMessage('Error deleting order. Please try again.');
    }
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-greeting">
          <h1>Welcome, {process.env.REACT_APP_ADMIN_NAME || 'Admin'}! 👋</h1>
          <p className="greeting-message">
            You have {getTodayOrders()} new orders today. Here's your dashboard overview.
          </p>
        </div>
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Add Products
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            View Orders
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="admin-section">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Product Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <p className="or-text">OR</p>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <button type="submit" className="submit-button">Create Product</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      ) : (
        <div className="admin-section">
          <h2>Order Management</h2>
          <div className="orders-list">
            {orders.length === 0 ? (
              <p className="no-orders">No orders found</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className={`status ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.user}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                  </div>
                  <div className="order-items">
                    {order.products.map((item, index) => (
                      <div key={index} className="order-item">
                        <p>{item.product} x {item.quantity}</p>
                        <p>₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => DeleteOrders(order._id)}>delete</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;