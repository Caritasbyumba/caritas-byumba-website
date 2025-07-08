import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { errorResponse, successResponse } from './Helpers/responses.js';
import userRoutes from './Routes/userRoutes.js';
import carouselRoutes from './Routes/carouselRoutes.js';
import moreonusRoutes from './Routes/moreonusRoutes.js';
import projectsRoutes from './Routes/projectsRoutes.js';
import footerLinksRoutes from './Routes/footerLinksRoutes.js';
import footerAddressRoutes from './Routes/footerAddressRoutes.js';
import aboutusRoutes from './Routes/aboutusRoutes.js';
import quotesRoutes from './Routes/quotesRoutes.js';
import partnersRoutes from './Routes/partnersRoutes.js';
import projectsIntroRoutes from './Routes/projectsIntroRoutes.js';
import partnersIntroRoutes from './Routes/partnersIntroRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import faqRoutes from './Routes/faqRoutes.js';
import publicationsRoutes from './Routes/publicationsRoutes.js';
import publicationsIntroRoutes from './Routes/publicationsIntroRoutes.js';
import donateIntroRoutes from './Routes/donateIntroRoutes.js';
import donationAreasRoutes from './Routes/donationAreasRoutes.js';
import donationRoutes from './Routes/donationRoutes.js';
import departmentRoutes from './Routes/departmentRoutes.js';
import serviceRoutes from './Routes/serviceRoutes.js';
import chartRoutes from './Routes/chartRoutes.js';
import advertRoutes from './Routes/advertRoutes.js';
import advertsIntroRoutes from './Routes/advertsIntroRoutes.js';
import donationMessageRoutes from './Routes/donationMessageRoutes.js';

dotenv.config();
const app = express();

// CORS Middleware
    const allowedOrigins = [
      'https://caritasbyumba.org', 
      'https://www.caritasbyumba.org',
      'http://localhost:3000']

app.use(
        cors({
          credentials: true,
          origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.indexOf(origin) === -1) {
              const msg = `The CORS policy for this site does not allow access from ${origin}`;
              return callback(new Error(msg), false);
            }
            return callback(null, true);
          },
          optionsSuccessStatus: 200,
        })
      );
  
// Logger Middleware
app.use(morgan('dev'));
// access body request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// DB Config
const db = process.env.DATABASE_URL_ATLAS;
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

// Connect to Mongo
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1); // Exit process on DB connection failure
});

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
app.get('/api/', (req, res) =>
  successResponse(res, 200, 'WELCOME TO CARITAS BYUMBA WEBSITE BACKEND')
);
app.use('/api/users/', userRoutes);
app.use('/api/carousels/', carouselRoutes);
app.use('/api/moreonus/', moreonusRoutes);
app.use('/api/projects/', projectsRoutes);
app.use('/api/footerlinks/', footerLinksRoutes);
app.use('/api/footeraddress/', footerAddressRoutes);
app.use('/api/aboutus/', aboutusRoutes);
app.use('/api/quotes/', quotesRoutes);
app.use('/api/partners/', partnersRoutes);
app.use('/api/projectsintro/', projectsIntroRoutes);
app.use('/api/partnersintro/', partnersIntroRoutes);
app.use('/api/messages/', messageRoutes);
app.use('/api/faqs/', faqRoutes);
app.use('/api/publications/', publicationsRoutes);
app.use('/api/publicationsintro/', publicationsIntroRoutes);
app.use('/api/donateintro/', donateIntroRoutes);
app.use('/api/donationareas/', donationAreasRoutes);
app.use('/api/donation/', donationRoutes);
app.use('/api/departments/', departmentRoutes);
app.use('/api/services/', serviceRoutes);
app.use('/api/charts/', chartRoutes);
app.use('/api/adverts/', advertRoutes);
app.use('/api/advertsintro/', advertsIntroRoutes);
app.use('/api/donationmessages/', donationMessageRoutes);

app.use((req, res) => {
  console.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  errorResponse(res, 404, 'The requested route was not found');
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  errorResponse(res, 500, 'Internal Server Error', {
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


export default app;
