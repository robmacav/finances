import { useState } from "react";

import Incomes from "./app/pages/incomes/Index"
import Expenses from "./app/pages/expenses/Index";
import Dashboard from "./app/pages/dashboard/Index";

import Matrac from "./app/pages/matrac/Index";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [month] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());

  return (
    <Router>
      <Routes>
        <Route path="/" element={ < Dashboard />} />
        <Route path="/matrac" element={ < Matrac />} />
        
        <Route path="/receitas" element={< Incomes month={month} year={year} />} />
        <Route path="/despesas" element={< Expenses month={month} year={year} />} />
      </Routes>
    </Router>
  )
}

export default App