import express from 'express';
import {
  SignUp,
  ReadAllUsers,
  UpdateUser,
  DeleteUser,
  GetUserProfile,
  SendOTP,
  Login,
} from './users.contoller';
const router = express();

router.post('/signup', SignUp);
router.post('/login', Login);
router.get('/allUsers', ReadAllUsers);
router.patch('/update/:id', UpdateUser);
router.delete('/delete/:id', DeleteUser);
router.get('/user/:id', GetUserProfile);
router.post('/send-otp', SendOTP);

export const UsersRouter = router;
