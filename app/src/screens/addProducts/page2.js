
import React from 'react';



const Page2 = ({ formData, handleInputChange, handleImageChange, images }) => {



  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Add Product</h1>
      <form className="space-y-4">
        {/* Product Name */}

        {/* Price */}
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">Color</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            required
          />
        </div>

        {/* Stock */}
        <div className='flex flex-row gap-3'>
          {/* <label className="block text-sm font-normal text-gray-400 mb-1">Stock</label> */}

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-normal text-gray-400 mb-1"
            value={formData.status}
            placeholder='Status'
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option className="border-indigo-300" value="">Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Pre-Order">Pre-Order</option>
          </select>

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-normal text-gray-400 mb-1"
            value={formData.tag}
            onChange={(e) => handleInputChange('tag', e.target.value)}
          >
            <option value="">Tag</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Limited Edition">Limited Edition</option>
            <option value="New Arrival">New Arrival</option>
          </select>
        </div>

        {/* Images */}
        <div className="w-full h-72 p-4 flex flex-col items-center justify-center border border-gray-300 rounded-lg overflow-hidden">
       <div className="w-full flex flex-col items-center">
         {/* Hidden file input */}
         <input
           type="file"
           multiple
           accept="image/*"
           className="hidden"
           id="file-upload"
           onChange={handleImageChange}
         />

         {/* Custom upload button */}
         <label
           htmlFor="file-upload"
           className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700"
         >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
           </svg> Upload Images
         </label>
       </div>

       {/* Display Selected Images */}
       <div className="mt-4 w-full flex flex-row flex-wrap justify-center gap-2 overflow-auto">
         {images.map((image, index) => (
           <img key={index} src={image} alt="preview" className="w-20 h-20 object-cover rounded-md border max-h-[100%]" />
         ))}
       </div>
     </div>

      </form>

      {/* Message
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      */}
    </div>
  );
};

export default Page2;
