import React, { useState, useEffect } from "react";

import { getIp } from '../../components/ip.js';

function Cart() {
  const ip = getIp();
  const [preOrder, setPreOrder] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(null);

  const [orderStatus, setOrderStatus] = useState('Closed');

  // const [preOrderId, setPreOrderId] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);



  useEffect(() => {
    const preOrderId = parseInt(localStorage.getItem('preOrderId'));

    fetch(`http://localhost:5000/preorder/${preOrderId}`)
      .then((response) => response.json())
      .then((data) => {
        setPreOrder(data); // ✅ now you're saving the correct array
        console.log('Fetched items:', data);
      })
      .catch((err) => console.error('Error fetching preOrder:', err));
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


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">preOrder</h2>

        <div className="mt-12 flex flex-col gap-y-16">
          {preOrder?.items?.map((item) => (
            <div key={item.id} className="flex flex-row gap-16 cursor-pointer p-4 border border-gray-300 shadow-md" onClick={() => openModal(item)}>
              <img
                alt={item.product.imageAlt || item.product.name}
                src={`data:image/png;base64,${item.product.images[item]?.data}`}
                className="w-26 h-12 rounded-md bg-gray-200 object-cover"
              />
              <h3 className="text-sm text-gray-700">{item.product.name}</h3>
              <h3 className="text-sm text-gray-700">{item.quantity}</h3>
              <h3 className="text-sm text-gray-700">{item.price}</h3>
              <h3 className="text-sm text-gray-700">{item.quantity * item.price}</h3>
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
                alt={selectedProduct.product.imageAlt || selectedProduct.product.name}
                src={`data:image/png;base64,${selectedProduct.product.images[selectedImageIndex]?.data}`}
                className="w-96 h-72 rounded-md bg-gray-200 object-cover"
              />

              {/* Thumbnail Images (Right Side) ALTERAR AQUI*/}
              <div className="w-96 flex flex-row gap-2 ml-1/2 overflow-hidden">
                {selectedProduct.product.images.map((image, index) => (
                  <img
                    key={index}
                    alt={selectedProduct.product.imageAlt || selectedProduct.product.name}
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
                  <p className="text-xs text-gray-400 font-md">{selectedProduct.product.category}</p>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-400 font-md">{selectedProduct.product.tag}</p>
                </div>
                <div className="px-4 py-2 border border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-400 font-md">{selectedProduct.product.status}</p>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-gray-700">{selectedProduct.product.name}</h2>
              <p className="text-xl font-medium text-gray-400 mt-2">
                {selectedProduct.product.brand ? `${selectedProduct.product.brand}` : 'Brand Unavailable'}
              </p>
              <p className="text-xl font-medium text-gray-900">
                {selectedProduct.product.price ? `$${selectedProduct.product.price}` : 'Price Unavailable'}
              </p>

              <div className="w-72">
                <p className=" text-base text-gray-700">{/*Details <br/>*/} {selectedProduct.product.description || 'No description available'}</p>
                <p className="text-md text-gray-600 mt-3 <br/>">Colors {selectedProduct.product.color || 'N/A'}</p>
                <p className="text-md text-gray-600 mt-3 <br/>">Quantity: {selectedProduct.quantity || 'product.stockN/A'}</p>


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
                className="w-72 flex justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                // onClick={() => addToCart(selectedProduct.id, quantity, selectedProduct.price)}
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              Save to Cart
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Cart;
