import { LoginForm } from '@/components/vendors/auth/LoginForm';
import { AuthWrapper } from '../AuthWrapper';

export const LoginPage = () => {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
};