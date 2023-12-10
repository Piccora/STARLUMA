import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Cart, Explore, Home, Preview, Login, Register } from "./pages/index";
import ProtectedRoute from "./ProtectedRoute";
import { getItemInCart } from "../data";

const App = () => {
  const loggedInState = localStorage.getItem("userId") ? true : false
  const [cartLoading, setCartLoading] = React.useState(false)

  if (loggedInState) {
    localStorage.removeItem("localCart")
    getItemInCart(localStorage.getItem("userId")).then((res) => {
      if (res === false) {
        setCartLoading(true)
        return
      }
      let cartItems = []
      res.forEach((x) => cartItems.push(x))
      localStorage.setItem("localCart", JSON.stringify(cartItems));
      setCartLoading(true)
    })
  }
  
  return (cartLoading === false && loggedInState === true) ? (<div>
    <h2>Still loading...</h2>
  </div>) : (
    <div className="bg-gray-50 dark:bg-[#121212] h-full overflow-y-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route element={<ProtectedRoute accessState={loggedInState} />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/preview/:id" element={<Preview />} />
        </Route>
        <Route
          path="*"
          element={
            <div>
              <h2>404 Page not found</h2>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
