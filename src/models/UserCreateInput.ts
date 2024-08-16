export default interface UserCreateInput {
    email: string;
    password: string;
    name: string;  
    phone?: string;  // Facultatif
    adresse?: string; // Facultatif
    role?: 'USER' | 'ADMIN';
  }