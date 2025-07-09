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
const MONGODB_URI = process.env.DATABASE_URL_ATLAS || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ No MongoDB connection string found in environment variables');
  process.exit(1);
}


// Connect to Mongo
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.log('Connection string used:', MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://USERNAME:PASSWORD@'));
});

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// ADD THIS ROOT ROUTE - This fixes the 404 error
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Caritas Byumba Website</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; text-align: center; }
        .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .api-link { background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        a { color: #1976d2; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Caritas Byumba Website</h1>
        <div class="status">
          <strong>✅ Server Status:</strong> Running successfully<br>
          <strong>✅ Database:</strong> ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}<br>
          <strong>✅ Environment:</strong> ${process.env.NODE_ENV || 'development'}
        </div>
        
        <div class="api-link">
          <strong>API Endpoint:</strong> <a href="/api/">/api/</a>
        </div>
        
        <p>This is the backend API for Caritas Byumba Website. The API is running and ready to serve requests.</p>
        
        <p>For API documentation and available endpoints, please visit: <a href="/api/">/api/</a></p>
      </div>
    </body>
    </html>
  `);
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