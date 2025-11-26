import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import WizardPage from "./pages/WizardPage";
import EmployeesPage from "./pages/EmployeesPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
