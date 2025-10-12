import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Index from "./app/pages/dashboard/Index";

function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
      </Router>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
