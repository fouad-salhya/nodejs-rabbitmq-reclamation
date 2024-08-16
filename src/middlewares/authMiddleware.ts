import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.jwt;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) 
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req["auth"] = decoded
    console.log(req['auth'].user_id)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const userId = req["auth"].user_id
    const user = await prisma.user.findFirst({
      where: {user_id: userId},
      select: { role: true }
    })
    
    if(user?.role !=='ADMIN') {
     return res.status(403).json({message: 'access denied'})
    }
    next()
  } catch (error) {
    res.status(500).json({error})
  }
   
}



