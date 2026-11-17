import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { Overview } from '@/pages/Overview';
import { DesignStudio } from '@/pages/DesignStudio';
import { ExploreTemplates } from '@/pages/ExploreTemplates';
import { MyDesigns } from '@/pages/MyDesigns';
import { Moodboards } from '@/pages/Moodboards';
import { FindDecorators } from '@/pages/FindDecorators';
import { ImplementationPlan } from '@/pages/ImplementationPlan';
import { Bookings } from '@/pages/Bookings';
import { AdminBookings } from '@/pages/AdminBookings';
import { Settings } from '@/pages/Settings';
import { ShareView } from '@/pages/ShareView';
import { Auth } from '@/pages/Auth';
const router = createBrowserRouter([
  { path: 'share/:shareId', element: <ShareView /> },
  { path: 'login', element: <Auth /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'studio', element: <DesignStudio /> },
      { path: 'templates', element: <ExploreTemplates /> },
      { path: 'designs', element: <MyDesigns /> },
      { path: 'designs/:designId/plan', element: <ImplementationPlan /> },
      { path: 'moodboards', element: <Moodboards /> },
      { path: 'decorators', element: <FindDecorators /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'admin', element: <AdminBookings /> },
      { path: 'admin/bookings', element: <Navigate to="/admin" replace /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <AppProvider><ToastProvider><RouterProvider router={router} /></ToastProvider></AppProvider>;
}
