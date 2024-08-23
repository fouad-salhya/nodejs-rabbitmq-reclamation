import jwt from 'jsonwebtoken';

export const generateToken = (user_id: string, role: string) => {
  return jwt.sign({ user_id, role }, process.env.JWT_SECRET!,{algorithm: 'HS256', expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
