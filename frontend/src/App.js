import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Artists from './pages/Artists';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Login from './pages/Login';
import ArtistLogin from './pages/ArtistLogin'; // Import ArtistLogin
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';
import ManageArtists from './pages/admin/ManageArtists';
import AddArtist from './pages/admin/AddArtist';
import PlaceOrder from './pages/PlaceOrder'; // New: Place Order Page
import UserOrders from './pages/UserOrders'; // New: User Orders Page
import ManageOrders from './pages/admin/ManageOrders'; // New: Admin Manage Orders Page
import ArtistDashboard from './pages/ArtistDashboard'; // New: Artist Dashboard Page

function App() {
    return (
        <AuthProvider>
            <ThemeProvider> {/* Wrap the app with ThemeProvider */}
                <Router>
                    <AppContent />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

// Separate Component for Conditional Rendering
const AppContent = () => {
    const location = useLocation();

    // Check if the current route starts with '/admin' or '/artist'
    const isAdminPage = location.pathname.startsWith('/admin');
    // const isArtistPage = location.pathname.startsWith('/artist');

    return (
        <>
            {/* Conditionally Render Navbar */}
            {!isAdminPage &&  <Navbar />}

            <Routes>
                {/* Public and Regular User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Artist-Specific Routes */}
                <Route path="/artist/login" element={<ArtistLogin />} /> {/* New: Artist Login */}
                <Route
                    path="/artist/dashboard"
                    element={
                        <PrivateRoute isAdminOnly={false}>
                            <ArtistDashboard />
                        </PrivateRoute>
                    }
                /> {/* New: Artist Dashboard */}

                {/* Order Routes */}
                <Route path="/place-order" element={<PlaceOrder />} /> {/* New: Place Order */}
                <Route path="/user/orders" element={<UserOrders />} /> {/* New: User Orders */}

                {/* Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute isAdminOnly={true}>
                            <AdminLayout />
                        </PrivateRoute>
                    }
                >
                    {/* Nested Admin Routes */}
                    <Route index element={<ManageArtists />} />
                    <Route path="artists" element={<ManageArtists />} />
                    <Route path="add-artist" element={<AddArtist />} />
                    <Route path="orders" element={<ManageOrders />} /> {/* New: Admin Manage Orders */}
                </Route>

                {/* Default Redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default App;