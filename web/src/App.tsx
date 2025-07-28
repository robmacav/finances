import Dashboard from "./app/pages/dashboard/Index";

import { Toaster } from "@/components/ui/sonner"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={ < Dashboard />} />

        </Routes>
      </Router>

      <Toaster />
    </>
  )
}

export default App