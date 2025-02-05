import { LoginForm } from '@/components/vendors/LoginForm';
import { AuthWrapper } from './AuthWrapper';

export const LoginPage = () => {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
};