
import './styles/main.css';
import React, { useState } from 'react';
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
import UserPanel from './User-Panel';
import Skup from './Skup'

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
          <Route path="/skup" element={<Skup />} />
          <Route path="/user-panel" element={<UserPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
