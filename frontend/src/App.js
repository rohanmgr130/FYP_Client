import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import OrderHistory from './Pages/OrderHistory';
import CartPage from './Pages/CartPage';
import Checkout from './Pages/Checkout';
import UserProfile from './Pages/Profile';
import Favorite from './Pages/Favorite';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/' element={<Home/>} />
        <Route path='/menus' element={<MenuPage/>} />
        <Route path='/order-history' element={<OrderHistory/>} />
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path='/favorites' element={<Favorite/>} />
      </Routes>
    </Router>
  );
}

export default App;