
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { Stethoscope, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'gp':
        return 'bg-light-purple text-purple-800 border-purple-300';
      case 'clinical_admin':
        return 'bg-soft-coral text-orange-800 border-orange-300';
      case 'patient':
      default:
        return 'bg-soft-green text-green-800 border-green-300';
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'gp':
        return 'GP';
      case 'clinical_admin':
        return 'Clinical Admin';
      case 'patient':
      default:
        return 'Patient';
    }
  };

  const getNavigationItems = () => {
    if (!user) {
      return [
        { name: 'Home', path: '/' },
        { name: 'Learn', path: '/education' },
        { name: 'Resources', path: '/instructions' },
        { name: 'Partner Zone', path: '/partner-zone' }
      ];
    }

    switch (userRole) {
      case 'gp':
        return [
          { name: 'Dashboard', path: '/gp-dashboard' },
          { name: 'Education', path: '/education' },
          { name: 'Guidelines', path: '/instructions' }
        ];
      case 'clinical_admin':
        return [
          { name: 'Dashboard', path: '/clinical-dashboard' },
          { name: 'Education', path: '/education' },
          { name: 'Guidelines', path: '/instructions' }
        ];
      case 'patient':
      default:
        return [
          { name: 'Home', path: '/' },
          { name: 'Symptom Tracker', path: '/symptom-tracker' },
          { name: 'Education', path: '/education' },
          { name: 'Partner Zone', path: '/partner-zone' }
        ];
    }
  };

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'SYLVIA Health';
    if (path.includes('/symptom-tracker')) return 'Symptom Tracker';
    if (path.includes('/patient-assessment')) return 'Assessment';
    if (path.includes('/patient-results')) return 'Results';
    if (path.includes('/gp-dashboard') || path.includes('/gp/dashboard')) return 'GP Dashboard';
    if (path.includes('/gp-results')) return 'Patient Results';
    if (path.includes('/clinical-dashboard') || path.includes('/clinical/dashboard')) return 'Clinical Dashboard';
    if (path.includes('/education')) return 'Education';
    if (path.includes('/instructions')) return 'Guidelines';
    if (path.includes('/partner-zone')) return 'Partner Zone';
    if (path.includes('/auth')) return 'Login';
    return 'SYLVIA Health';
  };

  // Show simplified navigation for public pages when not logged in
  const isPublicPage = !user && ['/', '/education', '/instructions', '/partner-zone', '/privacy-policy', '/auth'].includes(location.pathname);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-soft-coral-dark to-light-purple-dark rounded-xl flex items-center justify-center shadow-sm">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  SYLVIA Health
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {user ? "Healthcare Assessment Platform" : "Menopause Support Platform"}
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Current Page Title */}
          <div className="hidden md:block">
            <h2 className="text-lg font-medium text-gray-700">
              {getCurrentPageTitle()}
            </h2>
          </div>

          {/* Right: User Info and Actions */}
          <div className="flex items-center space-x-4">
            
            {user ? (
              <>
                {/* Desktop User Info */}
                <div className="hidden lg:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                      {user?.email}
                    </p>
                    <Badge variant="outline" className={`text-xs font-medium ${getRoleColor()}`}>
                      {getRoleDisplayName()}
                    </Badge>
                  </div>
                </div>

                {/* Desktop Sign Out */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-soft-coral hover:border-soft-coral-dark transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth" className="border-gray-300 text-gray-700 hover:bg-gentle-blue hover:border-gentle-blue-dark">
                    Login
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden border-gray-300 hover:bg-soft-coral"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              
              {user && (
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                    <Badge variant="outline" className={`text-xs font-medium mt-1 ${getRoleColor()}`}>
                      {getRoleDisplayName()}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {getNavigationItems().map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-soft-coral-dark hover:bg-gentle-blue rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Auth Actions */}
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full justify-center border-gray-300 text-gray-700 hover:bg-soft-coral hover:border-soft-coral-dark"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                    className="w-full justify-center border-gray-300 text-gray-700 hover:bg-gentle-blue hover:border-gentle-blue-dark"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
