import React, { useState } from "react";
import Page1 from "./page1";
import Page2 from "./page2";


import { getIp } from '../../components/ip.js';

const AddProduct = () => {
  const ip = getIp();
  const [page, setPage] = useState(1); // Track the current page

  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    status: '',
    tag: '',
    category: '',
    color: '',
    description: '',
    price: '',
    stock: '',
  });

  // Handle product data changes
  const handleInputChange = (key, value) => {
    setProductData({
      ...productData,
      [key]: value,
    });
  };

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    // Convert file list to an array of URLs
    const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));

    // Update state with selected images
    setImages(prevImages => [...prevImages, ...imageUrls]);
  };

  // Go to the next page
  const nextPage = () => {
    setPage(page + 1);
  };

  // Go to the previous page
  const prevPage = () => {
    setPage(page - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate product fields
    if (!productData.name || !productData.price || !productData.stock) {
      setMessage('Please fill out all required fields.');
      return;
    }

    // Create form data
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((file) => {
      formData.append('images', file); // Append actual File objects
    });

    console.log(formData);

    try {
      // Replace with your backend endpoint
      const response = await fetch(`http://${ip}:5000/addproducts`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Product added successfully!');
        setProductData({ name: '', brand: '', category: '', color: '', description: '', price: '', stock: '' });
        setImages([]);
      } else {
        setMessage('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="bg-indigo-100 min-h-screen flex items-center justify-center p-4">
  <div className="w-full h-full flex flex-col md:flex-row max-w-4xl mx-auto bg-white shadow-md rounded-md overflow-hidden">
    {/* Image Section */}
    <div className="md:w-1/2 p-6 bg-indigo-400 flex items-center justify-center">


      <div className="text-center">
        <h1 className="text-balance text-xl font-sans tracking-tight text-gray-900 sm:text-xl">
          Data to enrich your online business
        </h1>
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        </div>
        <a target="_blank" rel="noreferrer" href="https://storyset.com/people" style={{ cursor: 'default' }}>
          <img
            src="./boxes.svg"
            alt="Illustration"
            className="w-48 h-48 md:w-72 md:h-72 rounded-full"
          />
        </a>
        <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          Anim aute id magna aliqua ad ad non deserun
        </p>
        <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          See products registered.{' '}
          <a href="#" className="font-semibold text-indigo-600">
            <span aria-hidden="true" className="absolute inset-0" />
            Storage <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>


    </div>

    {/* Form Section */}
    <div className="md:w-1/2 p-6">
      {page === 1 && (
        <Page1
          formData={productData}
          handleInputChange={handleInputChange}
          nextPage={nextPage}
        />
      )}
      {page === 2 && (
        <Page2
          formData={productData}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          images={images}
          prevPage={prevPage}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Buttons */}
      <div className="w-full mt-5 flex items-center justify-end gap-x-6">
        {page === 2 && (
          <button
            className="text-sm/6 font-semibold text-gray-900"
            onClick={prevPage}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={page === 2 ? handleSubmit : nextPage}
        >
          {page === 2 ? 'Send' : 'Next'} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default AddProduct;
