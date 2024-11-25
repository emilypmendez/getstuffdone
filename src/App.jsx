import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ObjectivesPage from './pages/ObjectivesPage';
import Navbar from './components/Navbar';

import { AuthProvider } from './services/index';

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <div>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/objectives" element={ <ObjectivesPage /> } />
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
    </>
  );
}

export default App;
