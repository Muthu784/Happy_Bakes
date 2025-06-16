import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Products from './Pages/Products.jsx';
import LoginComponent from './Pages/Login.jsx';
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx';
import UserOrder from './Pages/UserOrder.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import VerifyOTP from './Pages/VerifyOTP.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import Register from './Pages/Register.jsx';
import Admin from './Pages/Admin.jsx';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/products" element={<Products />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/userorder" element={<UserOrder />} />
            <Route path="/Admin" element={<Admin/>} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/verifyotp" element={<VerifyOTP />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;