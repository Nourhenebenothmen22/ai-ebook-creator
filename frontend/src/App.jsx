import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ViewBookPage from './pages/ViewBookPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/dashboard' element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
        <Route path='/editor/:bookId' element={<ProtectedRoute><EditorPage/></ProtectedRoute>}/>
        <Route path='/view-book/:bookId' element={<ProtectedRoute><ViewBookPage/></ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
