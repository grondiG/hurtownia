
import './styles/main.css';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from './Login';
import Register from './Register';
import Main from './Main';
import General from './General';
import Product from './Product';



function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/general" element={<General />} />
          <Route path="/product" element={<Product />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
