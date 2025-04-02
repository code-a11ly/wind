import { useEffect, useState } from 'react';
import { getIp } from '../../components/ip.js';

function ProductList() {
  const ip = getIp();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch(`http://${ip}:5000/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative cursor-pointer" onClick={() => openModal(product)}>
              <img
                alt={product.imageAlt || product.name}
                src={
                  product.images && product.images[0]
                    ? `data:image/png;base64,${product.images[0].data}`
                    : 'https://via.placeholder.com/150'
                }
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-50"
              />
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
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

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative flex flex-row w-2/3 h-2/3 bg-white p-6 rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✖
            </button>

            <div className="flex flex-wrap gap-2">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    alt={selectedProduct.imageAlt || selectedProduct.name}
                    src={`data:image/png;base64,${image.data}`}
                    className="w-32 h-32 rounded-md bg-gray-200 object-cover group-hover:opacity-75"
                  />
                ))
              ) : (
                <img
                  alt="Placeholder"
                  src="https://via.placeholder.com/300"
                  className="w-32 h-32 rounded-md bg-gray-200 object-cover group-hover:opacity-75"
                />
              )}
            </div>
            <div className="pl-6">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <p className="text-lg text-gray-700 mt-4">{selectedProduct.description || 'No description available'}</p>
              <p className="text-xl font-medium text-gray-900 mt-2">
                {selectedProduct.price ? `$${selectedProduct.price}` : 'Price Unavailable'}
              </p>
              <p className="text-md text-gray-600 mt-1">Color: {selectedProduct.color || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
