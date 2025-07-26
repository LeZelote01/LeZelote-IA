import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import WorkflowStudio from "./pages/WorkflowStudio";
import NoCodeBuilder from "./pages/NoCodeBuilder";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import DocumentProcessor from "./pages/DocumentProcessor";
import LeadGeneration from "./pages/LeadGeneration";
import EmailMarketing from "./pages/EmailMarketing";
import CustomerService from "./pages/CustomerService";
import ApiManagement from "./pages/ApiManagement";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<><Header /><Dashboard /></>} />
              <Route path="/workflows" element={<><Header /><WorkflowStudio /></>} />
              <Route path="/builder" element={<><Header /><NoCodeBuilder /></>} />
              <Route path="/chat" element={<><Header /><Chat /></>} />
              <Route path="/analytics" element={<><Header /><Analytics /></>} />
              <Route path="/documents" element={<><Header /><DocumentProcessor /></>} />
              <Route path="/leads" element={<><Header /><LeadGeneration /></>} />
              <Route path="/email" element={<><Header /><EmailMarketing /></>} />
              <Route path="/support" element={<><Header /><CustomerService /></>} />
              <Route path="/api" element={<><Header /><ApiManagement /></>} />
              <Route path="/settings" element={<><Header /><Settings /></>} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

export default App;