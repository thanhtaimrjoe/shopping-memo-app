import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { MealsPage } from './pages/MealsPage.jsx'
import { ProductsPage } from './pages/ProductsPage.jsx'
import { WeeklyPlannerPage } from './pages/WeeklyPlannerPage.jsx'
import { ShoppingChecklistPage } from './pages/ShoppingChecklistPage.jsx'
import { ImportCsvPage } from './pages/ImportCsvPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/planner" element={<WeeklyPlannerPage />} />
        <Route path="/checklist" element={<ShoppingChecklistPage />} />
        <Route path="/import" element={<ImportCsvPage />} />
      </Route>
    </Routes>
  )
}

export default App
