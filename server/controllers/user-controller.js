const User = require('../models/UserModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const register = async (req, res) => {
    const { name, dateOfBirth, email, password } = req.body;
  
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      user = new User({
        name,
        dateOfBirth,
        email,
        password
      });
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // Save user to database
      await user.save();
  
      // Create JWT token
      const payload = {
        user: {
          id: user.id
        }
      };
  
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token, 
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              dateOfBirth: user.dateOfBirth
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create JWT token
      const payload = {
        user: {
          id: user.id
        }
      };
  
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token, 
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              dateOfBirth: user.dateOfBirth
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
}

export const getUser = async (req, res) => {
    try {
      const token = req.header('x-auth-token');
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.user.id).select('-password');
      
      res.json(user);
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
}  