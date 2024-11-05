import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar/Navbar';
import RegisterUser from './UserManagement/UserRegistration';
import UserLogin from './UserManagement/UserLogin';
import UserLogout from './UserManagement/UserLogout';
import UserProfile from './UserManagement/UserProfile';
import PurchaseHistory from './UserManagement/PurchaseHistory';
import StoreManagement from './UserManagement/StoreManagement';
import UserManagement from './AdminManagement/UserMangement';
import ItemsManagement from './AdminManagement/ItemsManagement';
import HomeItemListing from './Home/HomeItemListing';
import Review from './UserManagement/review';
import SellingHistory from './UserManagement/SellingHistory';
import Order from './Home/Order';
import ForgettingPassword from './UserManagement/ForgettingPassword';
import Analysis from './AdminManagement/Analysis';
import { Provider, useSelector } from 'react-redux';
import store from './store';



function App() {
  return (
    <div className="App">
      <Router>
        <Provider store={store}>
        <Navbar />
        <Routes>
          <Route exact path='/registeruser' element={<RegisterUser />} />
          <Route exact path='/login' element={<UserLogin />} />
          <Route exact path='/userprofile' element={<UserProfile />} />
          <Route exact path='/userlogout' element={<UserLogout />} />
          <Route exact path='/purchasehistory' element={<PurchaseHistory />} />
          <Route exact path='/storemanagement' element={<StoreManagement />} />
          <Route exact path='/usermanagement' element={<UserManagement />} />
          <Route exact path='/itemsmanagement' element={<ItemsManagement />} />
          <Route exact path='/order' element={<Order />} />
          <Route exact path='/review' element={<Review />} />
          <Route exact path='/' element={<HomeItemListing />} />
          <Route exact path='/sellinghistory' element={<SellingHistory />} />
          <Route exact path='/analysis' element={<Analysis />} />
          <Route exact path='/forgetpassword' element={<ForgettingPassword />} />
        </Routes>
        </Provider>
      </Router>
    </div>
  );
}

export default App;
