import { Routes, Route } from "react-router-dom";
import { Layout } from "./layout";
import HomePage from "@/pages/HomePage";
import CreateStockPage from "@/pages/CreateStock";

// Export a component with all routes
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/create-stock" element={<CreateStockPage />} />
      </Route>
    </Routes>
  );
}
