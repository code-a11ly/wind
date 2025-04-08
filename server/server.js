const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');



const session = require('express-session');
const passport = require('./auth/googleAuth');
const authRoutes = require('./routes/authRoutes');
const { refreshTokenHandler } = require('./auth/auth');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const multer = require('multer');
const jwt = require('jsonwebtoken');
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';



// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite Database Connection
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Routes

// Register a new user
app.post('/register', async (req, res) => {
    const { name, email, password, is_admin, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password, is_admin, role) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [name, email, hashedPassword, password, is_admin, role], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            console.error(err.message);
        } else {
            res.status(201).json({ id: this.lastID });
            console.log('User inserted successfully.');
            console.log(req.body);
        }
    });
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt with email:', email);

        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            if (!user) {
                console.error('No user found with email:', email);
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            console.log('Retrieved user from DB:', user);

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                console.error('Password mismatch for email:', email);
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            console.log('Password matched. Generating token...');
            const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, SECRET_KEY, { expiresIn: '1h' });

            res.json({
                token,
                name: user.name,
                email: user.email,
            });
        });
    } catch (error) {
        console.error('Unhandled error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Check if user exists in the database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });

      console.log('NAME:', name);
      console.log('EMAIL:', email);

      if (user) {
        // User found, log them in
        res.status(200).json({ message: 'User logged in', user });
      } else {
        // User not found, create a new user
        db.run(
          'INSERT INTO users (name, email, password, is_admin, role) VALUES (?, ?, ?, ?, ?)',
          [name, email, null, 0, 'Employee'], // Set password to NULL
          function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'User created', user: { id: this.lastID, name, email } });
          }
        );

      }
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Invalid token', error });
  }
});


// Protected route example
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Welcome, ${req.user.name}!`);
    } else {
        res.redirect('/auth/google');
    }
});




// Fetch all products
app.get('/products', (req, res) => {
    const sql = `
      SELECT
        p.id AS product_id,
        p.name,
        p.brand,
        p.status,
        p.tag,
        p.category,
        p.color,
        p.description,
        p.price,
        p.stock,
        p.created_at,
        pi.id AS image_id,
        pi.image AS image_data
      FROM
        products p
      LEFT JOIN
        product_images pi
      ON
        p.id = pi.product_id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: err.message });
        }

        // Group products by ID and aggregate their images
        const products = rows.reduce((acc, row) => {
            const { product_id, name, brand, status, tag, category, color, description, price, stock, created_at, image_id, image_data } = row;

            // Find or create the product in the result list
            let product = acc.find(p => p.id === product_id);
            if (!product) {
                product = {
                    id: product_id,
                    name,
                    brand,
                    status,
                    tag,
                    category,
                    color,
                    description,
                    price,
                    stock,
                    created_at,
                    images: [],
                };
                acc.push(product);
            }

            // Add the image to the product's images array (if it exists)
            if (image_id) {
                product.images.push({
                    id: image_id,
                    data: image_data.toString('base64'), // Convert image data to Base64 for safe transfer
                });
            }

            return acc;
        }, []);

        res.json(products);
    });
});


function saveProductToDatabase(name, brand = null, status = null, tag = null, category = null, color = null, description, price, stock) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO products (name, brand, status, tag, category, color, description, price, stock, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;

    db.run(query, [name, brand, status, tag, category, color, description, price, stock], function (err) {
      if (err) {
        console.error('Error inserting product:', err);
        reject(err);
      } else {
        console.log(`Inserted product ID: ${this.lastID}`);
        resolve(this.lastID); // Get the ID of the inserted product
      }
    });
  });
}

function saveImageToDatabase(productId, imageBuffer) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO product_images (product_id, image)
      VALUES (?, ?)
    `;
    db.run(query, [productId, imageBuffer], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const upload = multer({ storage: multer.memoryStorage() });

// Define the route for adding products
app.post('/addproducts', upload.array('images'), async (req, res) => {
  try {
    // Access text fields in req.body
    const { name, brand, status, tag, category, color, description, price, stock } = req.body;

    // Access images in req.files
    const images = req.files || []; // Ensure images is always an array

    console.log(req.body);

    if (!name || !price || !stock) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save product data to the database (correct order of parameters)
    const productId = await saveProductToDatabase(name, brand, status, tag, category, color, description, price, stock);

    // Save images to the database
    for (const image of images) {
      await saveImageToDatabase(productId, image.buffer);
    }

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Place an order
app.post('/orders', (req, res) => {
    const { user_id, items } = req.body;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderSql = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';

    db.run(orderSql, [user_id, total], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const orderId = this.lastID;

            const orderItemsSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
            items.forEach((item) => {
                db.run(orderItemsSql, [orderId, item.product_id, item.quantity, item.price]);
            });

            res.status(201).json({ order_id: orderId });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
