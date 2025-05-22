const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Schema creation
const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    is_admin BOOLEAN DEFAULT 0,
    role TEXT CHECK(role IN ('Admin', 'Seller', 'Client')) DEFAULT 'Client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    status TEXT,
    tag TEXT,
    category TEXT,
    color TEXT,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image BLOB NOT NULL, -- Storing binary image data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Pre_Order Section
CREATE TABLE IF NOT EXISTS pre_order (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    users_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('Open', 'Canceled', 'Closed')) DEFAULT 'Open',
    FOREIGN KEY(users_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pre_order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pre_order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(pre_order_id) REFERENCES pre_order(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);
`;

db.exec(schema, (err) => {
    if (err) {
        console.error('Error creating tables:', err.message);
    } else {
        console.log('Tables created successfully.');
    }
    db.close();
});
