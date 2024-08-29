import { Request, Response } from 'express';
import UserCreateInput from '../models/UserCreateInput';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { rabbitMQService } from '../services/RabbitMqService';


export const signup = async (req: Request, res: Response) => {
    
  try {
    
    const user_input: UserCreateInput = req.body;

    const hashed_password = await bcrypt.hash(user_input.password, 10)

    const user = await prisma.user.create({
      data: {
        ...user_input,
        password: hashed_password
      }
   })
    
  if(!user) {
    return res.status(400).json({err: "User not Created" })
  }  
  
    return res.status(201).json({ message: "User created" })

  } catch (err) {
    return res.status(500).json({err});
  }
  

};

export const signin = async (req: Request, res: Response) => {

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ 
      where: { email }, 
      select: {
        user_id:true,
        password: true,
        email:true,
        role: true
      }
    });

    if(!user) return res.status(404).json({err: 'user not found'})

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    
    if(!isPasswordValid) return  res.json({err: 'password incorrect' })

    const token = generateToken(user.user_id, user.role)
       
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'developement',
        maxAge: 3600000 
      });

    const user_id = user.user_id
    const role = user.role
    const message = "authenticated successfully"


    await rabbitMQService.sendUserDetails(user_id, role)


    res.status(200).json({ token, user: { user_id, role }, message });
  } catch (err) {
    res.status(500).json({err});
  }
};

export const signout = (req: Request, res: Response) => {
  try {
    res.clearCookie('jwt');  
    res.status(200).json({ message: 'User signed out' }); 
  } catch (err) {

    res.status(500).json({ err: 'An error occurred while signing out.' });
  }
};
