import { UserDashboardLayout } from '@/components/users/layout/layout';
import { WishlistPage } from '@/components/wishlist';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profile/wishlist/')({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <UserDashboardLayout>
      <WishlistPage/>
    </UserDashboardLayout>
  );
}