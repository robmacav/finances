import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./app/pages/dashboard/Index";
import Login from "./app/pages/Login"; 

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Home (pública)</h2>
      <Link to="/login">Ir para Login</Link>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* rota pública */}
            <Route path="/" element={<Home />} />

            {/* tela de login */}
            <Route path="/login" element={<Login />} />

            {/* rota protegida */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
