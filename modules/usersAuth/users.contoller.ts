import { Request, Response } from 'express';
import User from './users.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'fjkdjorioowuuroor';
const salt = 10;

// import { Users } from './users.model';

export const SignUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    } else {
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(400).json({ message: 'email already exist' });
      }
      const harshPassword = await bcrypt.hash(password, salt);

      await User.create({ ...req.body, password: harshPassword });
      return res.status(200).json({ message: 'successfully resgistered' });
    }
  } catch {
    return res.status(500).json({ message: 'can not signup' });
  }
};
export const ReadAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find({});
    return res.status(200).send(allUsers);
  } catch (error) {
    return res.status(500).send({ error: 'can not find all users' });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update the user by ID
    const updatedUser = await User.updateOne({ _id: id }, { $set: updateData });

    // Check if the update was successful
    if (updatedUser.modifiedCount === 0) {
      return res
        .status(404)
        .send({ error: 'User not found or no changes made.' });
    }

    return res.status(200).send({ message: 'User updated successfully.' });
  } catch (error) {
    return res
      .status(500)
      .send({ error: 'An error occurred while updating the user.' });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete the user by ID
    const deletedUser = await User.deleteOne({ _id: id });

    // Check if the delete was successful
    if (deletedUser.deletedCount === 0) {
      return res.status(404).send({ error: 'User not found.' });
    }

    return res.status(200).send({ message: 'User deleted successfully.' });
  } catch (error) {
    return res
      .status(500)
      .send({ error: 'An error occurred while deleting the user.' });
  }
};

export const GetUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user was found
    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    return res.status(200).send(user);
  } catch (error) {
    return res
      .status(500)
      .send({ error: 'An error occurred while retrieving the user profile.' });
  }
};

export const SendOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    // Ensure a phone number is provided
    if (!phoneNumber) {
      return res.status(400).send({ error: 'Phone number is required.' });
    }

    // Generate the OTP (this could be a random number, or you could use a library)
    const otp = Math.floor(100000 + Math.random() * 900000); // Example: 6-digit OTP

    // Send the OTP via an SMS service (e.g., Twilio)
    // Example with Twilio:
    /*
    const accountSid = 'your_account_sid';
    const authToken = 'your_auth_token';
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      body: `Your OTP code is ${otp}`,
      from: 'your_twilio_number',
      to: phoneNumber
    });
    */

    // Respond with a success message
    return res.status(200).send({ message: 'OTP sent successfully.' });
  } catch (error) {
    return res
      .status(500)
      .send({ error: 'An error occurred while sending the OTP.' });
  }
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT payload
    const payload = {
      user: {
        id: user._id,
      },
    };

    // Sign the JWT token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    console.log(err, 'error');
    return res.status(500).send('Server error');
  }
};
