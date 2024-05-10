import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ***************** Layouts *****************
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

// ***************** Pages *****************
import Home from './pages/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/contact';
import Login from './pages/Login/Login';
import Signup from './pages/Signup';
import Forgot from './pages/Forgot';

//import Support from './pages/Support/Support';
//import ModalerrortSP from './pages/Support/Modalerrorabout';

import Dashboard from './pages/Dashboard/Dashboard';
import Orders from './pages/Orders/Orders';
import Products from './pages/Products/Products';
import NewProduct from './pages/Products/NewProduct';
import EditProduct from './pages/Products/EditProduct';
import Inventory from './pages/Inventory/Inventory';
import SetInventory from './pages/Inventory/SetInventory';
import Customers from './pages/Customers/Customers';
import Stats from './pages/Stats/Stats';
import Coupons from './pages/Coupons/Coupons';
import Promotions from './pages/Promotions/Promotions';
import Delivery from './pages/Delivery/Delivery';
import Settings from './pages/Settings/Settings';

// ***************** Providers *****************
import { AppProvider } from './providers/AppProvider';
import { AuthProvider } from './providers/AuthProvider';


function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
             
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<Forgot />} />
            </Route>


            
            <Route path="/" element={<ProtectedLayout />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<NewProduct />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory/set" element={<SetInventory />} />
                <Route path="customers" element={<Customers />} />
                <Route path="stats" element={<Stats />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
