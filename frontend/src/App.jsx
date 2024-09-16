import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ***************** Layouts *****************
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

// ***************** Pages *****************
import Home from './pages/Home';
import About from './pages/About/About';
import ContactMain from './pages/ContactMain/ContactMain';
import Login from './pages/Login/Login';
import Signup from './pages/Signup';
import Forgot from './pages/Forgot';
import AccountConfirmation from './pages/AccountConfirmation';
import Reset from './pages/Reset';

import Support from './pages/Support/Support';
import Questions from './pages/Support/Questions';

import Dashboard from './pages/Dashboard/Dashboard';
import Orders from './pages/Orders/Orders';
import Products from './pages/Products/Products';
import NewProduct from './pages/Products/NewProduct';
import EditProduct from './pages/Products/EditProduct';
import Inventory from './pages/Inventory/Inventory';
import SetInventory from './pages/Inventory/SetInventory';
import Advertisements from './pages/Advertisements/Advertisements';
import NewAdvertisement from './pages/Advertisements/NewAdvertisement';
import EditAdvertisement from './pages/Advertisements/EditAdvertisement';
import Customers from './pages/Customers/Customers';
import Stats from './pages/Stats/Stats';
import Coupons from './pages/Coupons/Coupons';
import Promotions from './pages/Promotions/Promotions';
import Delivery from './pages/Delivery/Delivery';
import PointOfSale from './pages/PoS/PointOfSale';
import NewPointOfSale from './pages/PoS/NewPointOfSale';
import EditPointOfSale from './pages/PoS/EditPointOfSale';
import Contact from './pages/Contact/Contact';
import Settings from './pages/Settings/Settings';

import NotFound from './pages/NotFound/NotFound';

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
              <Route path="contact" element={<ContactMain />} />
              <Route path="support" element={<Support />} />
              <Route path="support/questions" element={<Questions />} />
             
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<Forgot />} />
              <Route path="reset-password/:token" element={<Reset />} />
              <Route path="confirm-account/:token" element={<AccountConfirmation />} />
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
                <Route path="advertisements" element={<Advertisements />} />
                <Route path="advertisements/new" element={<NewAdvertisement />} />
                <Route path="advertisements/edit/:id" element={<EditAdvertisement />} />
                <Route path="customers" element={<Customers />} />
                <Route path="stats" element={<Stats />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="pos" element={<PointOfSale />} />
                <Route path="pos/new" element={<NewPointOfSale />} />
                <Route path="pos/edit/:id" element={<EditPointOfSale />} />
                <Route path="contact" element={<Contact />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>

            

          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
