import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Map from "./pages/Map/Map";
import LandingPage from "./pages/Menu/LandingPage"; 
import UserAccounts from "./pages/Accounts/UserAccounts";
import ResetAccount from "./pages/AuthPages/Reset";
import NewPassword from "./pages/AuthPages/New";
import OTPForm from "./pages/AuthPages/OTP";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import { usePasswordResetCleanup } from './hooks/usePasswordResetCleanup';
import Soil from './pages/Soil/Soil';
import Crop from './pages/CropRecommendation/Crop';
import Request from './pages/Request/Request';
import FeaturePage from "./pages/Menu/FeaturePage"; 
import AboutSoil from "./pages/Menu/About_Soil";
import Contact from "./pages/Menu/Contact";
import SoilMap from "./pages/Menu/Soil-Location";
import CropDetailPage from "./pages/CropRecommendation/CropsDetailsPage";
import SoilDetailsPage from "./pages/Soil/SoilDetailsPage";
import SoilLocation from "./pages/Map/SoilLocation";
import LogsView from "./pages/LogPage/Logs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { seedRecommendationsIfMissing } from "./lib/seed-recommendations";

function AppContent() {
  usePasswordResetCleanup(); // Clean up tokens when navigating away from reset flow

  return (
    <Routes>
      {/* Public Routes - No Authentication Required */}
      <Route index element={<FeaturePage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/about-soil" element={<AboutSoil />} />
      <Route path="/soil-map" element={<SoilMap />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetAccount />
        </PublicRoute>
      } />
      <Route path="/otp" element={
        <PublicRoute>
          <OTPForm />
        </PublicRoute>
      } />
      <Route path="/new-password" element={
        <PublicRoute>
          <NewPassword />
        </PublicRoute>
      } />

          {/* Dashboard Layout - Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Home />} />

            {/* Others Page */}
            <Route path="/user-accounts" element={
              <RoleBasedRoute allowedRoles={['Admin']}>
                <UserAccounts />
              </RoleBasedRoute>
            } />
            <Route path="/soil-location" element={
              <RoleBasedRoute allowedRoles={['Admin', 'Soil Expert']}>
                <SoilLocation />
              </RoleBasedRoute>
            } />
            <Route path="/request" element={
              <RoleBasedRoute allowedRoles={['Admin']}>
                <Request />
              </RoleBasedRoute>
            } />
            <Route path="/logs" element={
              <RoleBasedRoute allowedRoles={['Admin']}>
                <LogsView />
              </RoleBasedRoute>
            } />
            <Route path="/maps" element={<Map />} />
            <Route path="/profile" element={<UserProfiles />} />
            
            {/* Forms */}
            <Route path="/crops" element={<Crop />} />
            <Route path="/soil" element={<Soil />} />
            <Route path="/crops/:id" element={<CropDetailPage />} />
            <Route path="/soil/:id" element={<SoilDetailsPage />} />
            {/* Charts */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
  );
}

export default function App() {
    useEffect(() => {
      seedRecommendationsIfMissing();
    }, []);
    
  return (
    <GoogleOAuthProvider clientId="180485865427-eccplulce91kki9p3f05i9pr63a9b8j9.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
          <ToastContainer />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
