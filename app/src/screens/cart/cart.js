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

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate action or async call
    setTimeout(() => {
      setIsLoading(false);
      // your confirm logic here
    }, 2000);
  };



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

  const total = preOrder?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-100">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Pre-Order</h2>

      <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 px-4 md:px-12 lg:px-32">
        {/* Left - Items */}
        <div className="flex flex-col gap-y-4 w-full lg:w-3/4">
          {preOrder?.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 cursor-pointer p-4 bg-white border rounded-lg shadow-md transition-transform hover:scale-[1.01]"
              onClick={() => openModal(item)}
            >
              <img
                alt={item.product.imageAlt || item.product.name}
                src={`data:image/png;base64,${item.product.images[0].data}`}
                className="w-24 h-12 rounded-md bg-gray-200 object-cover"
              />
              <div className="flex-1 grid grid-cols-4 gap-4 text-sm text-gray-700">
                <span>{item.product.name}</span>
                <span>{item.quantity}</span>
                <span>${item.price}</span>
                <span>${(item.quantity * item.price).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Confirm Button */}
        <div className="flex flex-col items-center justify-center w-full h-1/2 overflow-auto bg-white lg:w-1/4 p-4 border rounded-lg shadow-md gap-4">
          <h3 className="text-xl font-bold text-gray-900">Resumo do pedido</h3>

          <p className="text-sm text-gray-600">
            {preOrder?.items?.length || 0} item(s)
          </p>

          <div className="text-lg font-semibold text-gray-800">
            Total: ${total?.toFixed(2)}
          </div>

          <p className="text-xs text-gray-500">* Taxas incluídas</p>

          <button
            type="button"
            aria-label="Confirmar compra"
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343..."/>
                </svg>
                Confirmar compra
              </>
            )}
          </button>
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

              <div className="w-80">
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
    </div>
  );
}

export default Cart;
