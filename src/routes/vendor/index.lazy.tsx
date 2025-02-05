import { createLazyFileRoute } from '@tanstack/react-router';
import { AdminDashboardLayout } from '@/components/vendors/layout/vendor-dashboard.layout';
import { DashboardContent } from '@/components/vendors/dashboard-content';

export const Route = createLazyFileRoute('/vendor/')({
  component: VendorDashboard,
});

function VendorDashboard() {
  return (
    <AdminDashboardLayout>
      <DashboardContent />
    </AdminDashboardLayout>
  );
}