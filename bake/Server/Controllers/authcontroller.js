const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User register
exports.register = async (req, res) => {
  const { username, email, password, phone, name } = req.body;
  try {
    const user = new User({ username, email, password, phone, name });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('User registration error:', err); // Log the error
    res.status(500).json({ error: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Check if user is admin
    const isAdmin = email === process.env.ADMIN_EMAIL;
    const role = isAdmin ? 'admin' : 'user';
    
    console.log('Login attempt:', { email, isAdmin, role }); // Debug log

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set cookie with more permissive settings for development
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 3600000, // 1 hour
      path: '/' // Ensure cookie is available for all paths
    });

    // Send token in response for client-side storage
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        isAdmin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// // Send OTP to user's email
// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     // Generate a 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     await user.save();

//     // Send OTP via email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'OTP for Email Verification',
//       text: `Your OTP for email verification is: ${otp}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'OTP sent successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Verify OTP
// exports.verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

//     // Mark user as verified and clear OTP
//     user.isVerified = true;
//     user.otp = null;
//     await user.save();

//     res.status(200).json({ message: 'Email verified successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
