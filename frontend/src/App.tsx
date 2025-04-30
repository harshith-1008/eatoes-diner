import { Routes, Route } from "react-router-dom";
import { Navabar } from "./components/Navbar";
import { Menu } from "./pages/Menu";
import { Cart } from "./pages/Cart";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { OrderHistory } from "./pages/OrderHistory";

import { useState } from "react";

function App() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  return (
    <>
      <Navabar cartItems={cartItems} />
      <Routes>
        <Route
          path="/"
          element={<Menu cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<OrderHistory />} />
      </Routes>
    </>
  );
}

export default App;
