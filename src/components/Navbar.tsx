import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-green font-display font-bold text-bg">
            G
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Golf<span className="text-accent-green">Gives</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold hover:text-accent-green">
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-semibold text-accent-purple hover:underline">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn-secondary py-2 text-sm">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold hover:text-accent-green">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary py-2 text-sm">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
