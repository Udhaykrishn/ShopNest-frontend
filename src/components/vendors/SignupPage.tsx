import { SignupForm } from '@/components/vendors/sign-up';
import { AuthWrapper } from './AuthWrapper';

export const SignupPage = () => {
    return (
        <AuthWrapper>
            <SignupForm />
        </AuthWrapper>
    );
};