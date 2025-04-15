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

const upload = multer({ storage: multer.memoryStorage() });



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
                id: user.id,
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



app.use(session({
  secret: SECRET_KEY, // use a strong secret in production
  resave: false,
  saveUninitialized: true
}));

function createPreOrder(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO pre_order (users_id, status)
      VALUES (?, 'Open')
    `;
    db.run(query, [userId], function (err) {
      if (err) reject(err);
      else resolve(this.lastID); // ID of the new pre_order
    });
  });
}



app.post('/start-preorder', async (req, res) => {
  const { users_id } = req.body;

  if (!users_id) return res.status(400).json({ error: 'Missing user ID' });

  try {
    const preOrderId = await createPreOrder(users_id);
    req.session.pre_order_id = preOrderId; // Store in session
    res.status(201).json({ message: 'Pre-order started', preOrderId });
    console.log('Pre-order started', preOrderId);
  } catch (err) {
    console.log('error: Could not create pre-order');
    res.status(500).json({ error: 'Could not create pre-order' });


  }
});

app.post('/add-to-preorder', async (req, res) => {
  // const pre_order_id = req.session.pre_order_id;
  const { preOrderId, product_id, quantity, price } = req.body;

  console.log( preOrderId, product_id, quantity, price);

  if (!preOrderId) {
    return res.status(400).json({ error: 'No active pre-order. Please start one first.' });
  }

  if (!product_id || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await addPreOrderItem(preOrderId, product_id, quantity, price);
    res.status(201).json({ message: 'Item added to current pre-order' });
  } catch (err) {
    res.status(500).json({ error: 'Could not add item' });
  }
});




function subtractStock(productId, quantity) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET stock = stock - ?
      WHERE id = ? AND stock >= ?
    `;

    db.run(query, [quantity, productId, quantity], function (err) {
      if (err) reject(err);
      else if (this.changes === 0) {
        reject(new Error('Not enough stock available'));
      } else resolve();
    });
  });
}

function addPreOrderItem(preOrderId, productId, quantity, price) {
  return new Promise(async (resolve, reject) => {
    try {
      await subtractStock(productId, quantity); // Deduct first

      const query = `
        INSERT INTO pre_order_items (pre_order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `;

      db.run(query, [preOrderId, productId, quantity, price], function (err) {
        if (err) reject(err);
        else resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}


app.post('/cancel-preorder', async (req, res) => {
  const pre_order_id = req.session.pre_order_id;

  if (!pre_order_id) {
    return res.status(400).json({ error: 'No active pre-order to cancel' });
  }

  try {
    // 1. Get all items from pre_order
    const items = await new Promise((resolve, reject) => {
      db.all(`SELECT product_id, quantity FROM pre_order_items WHERE pre_order_id = ?`, [pre_order_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // 2. Add quantities back to stock
    const updateStock = `UPDATE products SET stock = stock + ? WHERE id = ?`;
    for (const item of items) {
      await new Promise((resolve, reject) => {
        db.run(updateStock, [item.quantity, item.product_id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 3. Update pre_order status
    await new Promise((resolve, reject) => {
      db.run(`UPDATE pre_order SET status = 'Canceled' WHERE id = ?`, [pre_order_id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 4. Clear session
    req.session.pre_order_id = null;

    res.json({ message: 'Pre-order canceled and stock restored' });
  } catch (err) {
    console.error('Error canceling pre-order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/close-preorder', (req, res) => {
  req.session.pre_order_id = null;
  res.json({ message: 'Pre-order closed' });
});




// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
