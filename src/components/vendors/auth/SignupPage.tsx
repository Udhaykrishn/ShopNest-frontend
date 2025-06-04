import { SignupForm } from '@/components/vendors/auth/sign-up';
import { AuthWrapper } from '../AuthWrapper';

export const SignupPage = () => {
    return (
        <AuthWrapper>
            <SignupForm />
        </AuthWrapper>
    );
};