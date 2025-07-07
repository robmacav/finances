import Dashboard from "./app/pages/dashboard/Index";

import Incomes from "./app/pages/incomes/Index"
import Expenses from "./app/pages/expenses/Index";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={ < Dashboard />} />
        
        <Route path="/receitas" element={< Incomes />} />
        <Route path="/despesas" element={< Expenses />} />
      </Routes>
    </Router>
  )
}

export default App