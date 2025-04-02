import React, { useState } from 'react';


const Page1 = ({ formData, handleInputChange }) => {


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Add Product</h1>
      <form className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

        <div className='flex flex-row gap-3'>
        {/* Stock */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Brand</label>
          <input
            type="number"
            className="w-full w-3/10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
            value={formData.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Category</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-normal text-gray-400 mb-1"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">Choose..</option>
            <option value="Electronics & Technology">Electronics & Technology</option>
            <option value="Clothing & Fashion">Clothing & Fashion</option>
            <option value="Home & Furniture">Home & Furniture</option>
            <option value="Home & Furniture">Sports & Outdoor</option>
            <option value="Home & Furniture">Home & Furniture</option>
          </select>
        </div>
        </div>

        <div className='flex flex-row gap-3'>
        {/* Stock */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Stock</label>
          <input
            type="number"
            className="w-full w-3/10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
            value={formData.stock}
            onChange={(e) => handleInputChange('stock', e.target.value)}
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            className="flex-[3] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            required
          />
        </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            style={{ resize: 'none' }}
            rows="6"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          ></textarea>
        </div>

      </form>

    </div>
  );
};

export default Page1;
