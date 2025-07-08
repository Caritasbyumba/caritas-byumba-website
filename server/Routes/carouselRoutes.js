import express from 'express';
import {
  activateCarousel,
  archiveCarousel,
  createCarousel,
  deleteCarousel,
  getActiveCarousels,
  getAllCarousels,
  getSpecificCarousel,
  updateCarousel,
} from '../Controller/carouselController.js';
import checkCarousel from '../Middlewares/checkCarousel.js';
import checkToken from '../Middlewares/checkToken.js';
import upload from '../Middlewares/uplaod.js';

const router = express.Router();

// Add request logging middleware for this route
router.use((req, res, next) => {
  console.log(`Carousel Route Request: ${req.method} ${req.path}`);
  next();
});

// Route to get active carousels (public access)
router.get('/active', async (req, res, next) => {
  try {
    await getActiveCarousels(req, res, next);
  } catch (err) {
    console.error('Error in /active route:', err);
    next(err);
  }
});

// Protected routes (require token)
router.use(checkToken);

// Route to get all carousels
router.get('', async (req, res, next) => {
  try {
    await getAllCarousels(req, res, next);
  } catch (err) {
    console.error('Error in GET / route:', err);
    next(err);
  }
});

// Route to get specific carousel
router.get('/:itemId', async (req, res, next) => {
  try {
    await getSpecificCarousel(req, res, next);
  } catch (err) {
    console.error('Error in GET /:itemId route:', err);
    next(err);
  }
});

// Route to create new carousel
router.post(
  '/add',
  upload.single('image'),
  checkCarousel,
  async (req, res, next) => {
    try {
      await createCarousel(req, res, next);
    } catch (err) {
      console.error('Error in POST /add route:', err);
      next(err);
    }
  }
);

// Route to update carousel
router.patch(
  '/:itemId',
  upload.single('image'),
  checkCarousel,
  async (req, res, next) => {
    try {
      await updateCarousel(req, res, next);
    } catch (err) {
      console.error('Error in PATCH /:itemId route:', err);
      next(err);
    }
  }
);

// Route to delete carousel
router.delete('/:itemId', async (req, res, next) => {
  try {
    await deleteCarousel(req, res, next);
  } catch (err) {
    console.error('Error in DELETE /:itemId route:', err);
    next(err);
  }
});

// Route to activate carousel
router.patch('/activate/:itemId', async (req, res, next) => {
  try {
    await activateCarousel(req, res, next);
  } catch (err) {
    console.error('Error in PATCH /activate/:itemId route:', err);
    next(err);
  }
});

// Route to archive carousel
router.patch('/archive/:itemId', async (req, res, next) => {
  try {
    await archiveCarousel(req, res, next);
  } catch (err) {
    console.error('Error in PATCH /archive/:itemId route:', err);
    next(err);
  }
});

export default router;