import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Auth } from '@/pages/Auth';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
const Overview = lazy(() => import('@/pages/Overview').then((module) => ({ default: module.Overview })));
const DesignStudio = lazy(() => import('@/pages/DesignStudio').then((module) => ({ default: module.DesignStudio })));
const ExploreTemplates = lazy(() => import('@/pages/ExploreTemplates').then((module) => ({ default: module.ExploreTemplates })));
const MyDesigns = lazy(() => import('@/pages/MyDesigns').then((module) => ({ default: module.MyDesigns })));
const Moodboards = lazy(() => import('@/pages/Moodboards').then((module) => ({ default: module.Moodboards })));
const FindDecorators = lazy(() => import('@/pages/FindDecorators').then((module) => ({ default: module.FindDecorators })));
const ImplementationPlan = lazy(() => import('@/pages/ImplementationPlan').then((module) => ({ default: module.ImplementationPlan })));
const Budget = lazy(() => import('@/pages/Budget').then((module) => ({ default: module.Budget })));
const Bookings = lazy(() => import('@/pages/Bookings').then((module) => ({ default: module.Bookings })));
const AdminBookings = lazy(() => import('@/pages/AdminBookings').then((module) => ({ default: module.AdminBookings })));
const Settings = lazy(() => import('@/pages/Settings').then((module) => ({ default: module.Settings })));
const ShareView = lazy(() => import('@/pages/ShareView').then((module) => ({ default: module.ShareView })));
const page = (Component) => <Suspense fallback={<div className="p-8 text-sm text-charcoal/50">Loading…</div>}><Component /></Suspense>;
const router = createBrowserRouter([
  { path: 'share/:shareId', element: page(ShareView) },
  { path: 'login', element: page(Auth) },
  {
    element: <AppShell />,
    children: [
      { index: true, element: page(Overview) },
      { path: 'studio', element: page(DesignStudio) },
      { path: 'templates', element: page(ExploreTemplates) },
      { path: 'designs', element: page(MyDesigns) },
      { path: 'designs/:designId/plan', element: page(ImplementationPlan) },
      { path: 'moodboards', element: page(Moodboards) },
      { path: 'budget', element: page(Budget) },
      { path: 'decorators', element: page(FindDecorators) },
      { path: 'bookings', element: page(Bookings) },
      { path: 'admin', element: page(AdminBookings) },
      { path: 'admin/bookings', element: <Navigate to="/admin" replace /> },
      { path: 'settings', element: page(Settings) },
    ],
  },
]);

export default function App() {
  return <AppProvider><ToastProvider><RouterProvider router={router} /></ToastProvider></AppProvider>;
}
