export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
    
          {children}
        </div>
      
    );
  }
  