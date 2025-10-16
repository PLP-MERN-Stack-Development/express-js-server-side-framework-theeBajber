const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('../errors/customErrors'); // Import custom errors
const validationMiddleware = require('../middleware/validation'); // Import validation middleware

const router = express.Router();
const products = [ // In-memory data from starter code
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// GET /api/products: List all products with filtering and pagination
router.get('/', (req, res, next) => {
  try {
    let filteredProducts = products;

    // Filtering by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === req.query.category
      );
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      total: filteredProducts.length,
      page,
      limit,
      data: paginatedProducts,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id: Get a specific product
router.get('/:id', (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      const error = new NotFoundError('Product not found');
      return next(error);
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products: Create a new product
router.post('/', validationMiddleware.validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id: Update a product
router.put('/:id', validationMiddleware.validateProduct, (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      const error = new NotFoundError('Product not found');
      return next(error);
    }
    products[index] = { id: req.params.id, ...req.body };
    res.json(products[index]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id: Delete a product
router.delete('/:id', (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      const error = new NotFoundError('Product not found');
      return next(error);
    }
    products.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// GET /api/products/search: Search products by name
router.get('/search', (req, res, next) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const searchResults = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    res.json(searchResults);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/stats: Get product statistics
router.get('/stats', (req, res, next) => {
  try {
    const stats = products.reduce((acc, product) => {
      if (acc[product.category]) {
        acc[product.category]++;
      } else {
        acc[product.category] = 1;
      }
      return acc;
    }, {});
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
