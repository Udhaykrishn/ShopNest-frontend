import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;