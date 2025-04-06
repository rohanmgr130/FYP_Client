import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import FavouritePage from './Pages/FavouritePage';
import OrderHistory from './Pages/OrderHistory';
import CartPage from './Pages/CartPage';
import Checkout from './Pages/Checkout';
import Orderplace from './Pages/Orderplace';
import OrderConfirm from './Pages/OrderConfirm'; 

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
        <Route path='/checkout' element={<Checkout/>} />
        <Route path="/orderplace" element={<Orderplace />} />
        <Route path="/order-confirm" element={<OrderConfirm />} />
      </Routes>
    </Router>
  );
}

export default App;