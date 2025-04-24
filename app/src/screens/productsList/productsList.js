import React, { useState, useEffect } from "react";

import { getIp } from '../../components/ip.js';

function ProductList() {
  const ip = getIp();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(null);

  const [orderStatus, setOrderStatus] = useState('Closed');

  // const [preOrderId, setPreOrderId] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);


  useEffect(() => {
    fetch(`http://${ip}:5000/products`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setMaxQuantity(product.stock);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setMaxQuantity(null);
  };


  const [quantity, setQuantity] = useState(1);


  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  const addToCart = async (product_id, quantity, price) => {

    if (orderStatus == ('Closed' || 'Canceled' || '')) {
      // Get the ID from localStorage and convert it to an integer
      const users_id = parseInt(localStorage.getItem('id')) || 0; // Fallback to 0 if invalid
      console.log('ID (type):', users_id, typeof users_id); // Should log a number

      try {
          const response = await fetch(`http://${ip}:5000/start-preorder`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ users_id }), // Now sends an integer
          });

          if (response.ok) { // Checks for status 200-299
              console.log('Preorder started successfully');
              const data = await response.json();

              console.log(data.preOrderId);

              localStorage.setItem('preOrderId', data.preOrderId);
              setOrderStatus('Open');
          } else if (response.status === 401) {
              console.error('Invalid credentials!');
          } else {
              console.error('Failed to start preorder. Status:', response.status);
          }
      } catch (error) {
          console.error('Network error:', error);
      }
    }

    const preOrderId = parseInt(localStorage.getItem('preOrderId')); // Fallback to 0 if invalid
    console.log('order (type):', preOrderId, typeof preOrderId); // Should log a number

    try {
        const response = await fetch(`http://${ip}:5000/add-to-preorder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ preOrderId, product_id, quantity, price }), // Now sends an integer
        });

        if (response.ok) { // Checks for status 200-299
            console.log('Preorder started successfully');
            const data = await response.json();
            localStorage.removeItem('cart');
        } else if (response.status === 401) {
            console.error('Invalid credentials!');
        } else {
            console.error('Failed to start itens preorder. Status:', response.status);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
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
          <div className="relative flex flex-row bg-white p-6 rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✖
            </button>

            {/* Left Section: Images */}
            <div>
              <div className="flex flex-col gap-3">
              {/* Main Image */}
              <img
                alt={selectedProduct.imageAlt || selectedProduct.name}
                src={`data:image/png;base64,${selectedProduct.images[selectedImageIndex]?.data}`}
                className="w-96 h-72 rounded-md bg-gray-200 object-cover"
              />

              {/* Thumbnail Images (Right Side) ALTERAR AQUI*/}
              <div className="w-96 flex flex-row gap-2 ml-1/2 overflow-hidden">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    alt={selectedProduct.imageAlt || selectedProduct.name}
                    src={`data:image/png;base64,${image.data}`}
                    className={`w-16 h-16 rounded-md bg-gray-200 object-cover cursor-pointer
                      ${selectedImageIndex === index ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            </div>
            {/* Right Section: Product Details */}
            <div className="flex flex-col pl-7 gap-2">
              <div className="flex flex-row gap-1">
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-400 font-md">{selectedProduct.category}</p>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-400 font-md">{selectedProduct.tag}</p>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-400 font-md">{selectedProduct.status}</p>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-gray-700">{selectedProduct.name}</h2>
              <p className="text-xl font-medium text-gray-400 mt-2">
                {selectedProduct.brand ? `${selectedProduct.brand}` : 'Brand Unavailable'}
              </p>
              <p className="text-xl font-medium text-gray-900">
                {selectedProduct.price ? `$${selectedProduct.price}` : 'Price Unavailable'}
              </p>

              <div className="w-72">
                <p className=" text-base text-gray-700">{/*Details <br/>*/} {selectedProduct.description || 'No description available'}</p>
                <p className="text-md text-gray-600 mt-3 <br/>">Colors {selectedProduct.color || 'N/A'}</p>
                <p className="text-md text-gray-600 mt-3 <br/>">Quantity: {selectedProduct.stock || 'N/A'}</p>


                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="px-4 text-lg">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-72 flex justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg
                           hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
                           active:scale-95 transition-transform duration-100"
                onClick={() => addToCart(selectedProduct.id, quantity, selectedProduct.price)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Add to Cart
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductList;
