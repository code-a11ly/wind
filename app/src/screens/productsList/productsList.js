import { useEffect, useState } from 'react';
import { getIp } from '../../components/ip.js';

function ProductList() {
  const ip = getIp();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://${ip}:5000/products`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Product Image */}
              <img
                alt={product.imageAlt || product.name}
                src={
                  product.images && product.images[0]
                    ? `data:image/png;base64,${product.images[0].data}`
                    : 'https://via.placeholder.com/150' // Fallback image
                }
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-50"
              />

              {/* Product Info */}
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color || 'N/A'}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {product.price ? `$${product.price}` : 'Price Unavailable'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
