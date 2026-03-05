import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'test_secret';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};



export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {


      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const user = await User.findOne({ email });

   
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token               
});
      
    } else {


      return res.status(401).json({ message: 'Invalid email or password' });
    
    
    
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error during login' });
  }


 
};