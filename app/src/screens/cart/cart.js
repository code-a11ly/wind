import React, { useState, useEffect } from "react";

import { getIp } from '../../components/ip.js';

function Cart() {
  const ip = getIp();
  const [products, setProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(null);


  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);


  useEffect(() => {
    setProducts(localStorage.cart.product);
  }, []);

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



    </div>
  );
}

export default Cart;
