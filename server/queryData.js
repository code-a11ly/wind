const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./data.db');

// Load product data
const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

db.serialize(() => {
  db.run('BEGIN TRANSACTION');

  products.forEach((product) => {
    const {
      name, brand, status, tag, category,
      color, description, price, stock, images
    } = product;

    db.run(
      `INSERT INTO products (name, brand, status, tag, category, color, description, price, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand, status, tag, category, color, description, price, stock],
      function (err) {
        if (err) {
          console.error('Product insert error:', err.message);
          return;
        }

        const productId = this.lastID;

        // Insert images
        images.forEach((imageName) => {
          const imagePath = path.join(__dirname, 'images', imageName);
          const imageData = fs.readFileSync(imagePath);

          db.run(
            `INSERT INTO product_images (product_id, image) VALUES (?, ?)`,
            [productId, imageData],
            (err) => {
              if (err) {
                console.error(`Image insert error for ${imageName}:`, err.message);
              }
            }
          );
        });
      }
    );
  });

  db.run('COMMIT', () => {
    console.log('✅ All products and images inserted successfully!');
    db.close();
  });
});
