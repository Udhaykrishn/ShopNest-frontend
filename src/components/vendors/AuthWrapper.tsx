
export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center text-primary">
            {children}
        </div>
    )
}
