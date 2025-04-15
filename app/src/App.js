import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavBar from './screens/navbar/navbar.js';
import Home from './screens/home/home.js';
import Login from './screens/login/login.js';

import AddProduct from './screens/addProducts/addProducts.js';
import ProductList from './screens/productsList/productsList.js';

import NotFound from './screens/notfound.js';
import Cart from './screens/cart/cart.js';


const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addProducts" element={<AddProduct />} />
        <Route path="/productsList" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
