import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import FavouritePage from './Pages/FavouritePage';
import OrderHistory from './Pages/OrderHistory';
import CartPage from './Pages/CartPage';





function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/menus' element={<MenuPage/>} />
        <Route path='/favorites' element={<FavouritePage/>} />
        <Route path='/order-history' element={<OrderHistory/>} />
        <Route path='/cart' element={<CartPage/>} />

      </Routes>

    </Router>
  );
}

export default App;
