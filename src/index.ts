import express, { Express } from "express";
import dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { rabbitMQService } from "./services/RabbitMqService";
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes' 
import { config } from 'dotenv';
import { resolve } from 'path';

const env = process.env.NODE_ENV || 'development';
const envPath = resolve(__dirname, `../.env.${env}`);
config({ path: envPath }); 

const app:Express = express()

const corsOptions = {
  origin: 'http://localhost:4200', 
  optionsSuccessStatus: 200
};

// Utiliser les middlewares
app.use(morgan('dev'));
app.use(helmet.hidePoweredBy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Utiliser les routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)


// server rabbit 
rabbitMQService.connect()
               .then(() => console.log('rabbit connected'))
               .catch((err) => console.log(err))

// server
if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`server started to port ${port}...`));
  }


export default app;