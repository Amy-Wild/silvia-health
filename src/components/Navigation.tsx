
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { Stethoscope, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const Navigation = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'gp':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clinical_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'patient':
      default:
        return 'bg-green-100 text-green-800 border-green-200';
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
    switch (userRole) {
      case 'gp':
        return [
          { name: 'Dashboard', path: '/gp/dashboard' },
          { name: 'Patient Assessments', path: '/gp/dashboard' }
        ];
      case 'clinical_admin':
        return [
          { name: 'Dashboard', path: '/clinical/dashboard' },
          { name: 'Analytics', path: '/clinical/dashboard' }
        ];
      case 'patient':
      default:
        return [
          { name: 'Home', path: '/' },
          { name: 'Start Assessment', path: '/patient-assessment/new' },
          { name: 'Education', path: '/education' },
          { name: 'Symptom Tracker', path: '/symptom-tracker' }
        ];
    }
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SILVIA Health</h1>
              <p className="text-xs text-gray-600 hidden sm:block">
                Symptom Intake & Liaison for Vital Insight & Assessment
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {getNavigationItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <Badge variant="outline" className={getRoleColor()}>
                  {getRoleDisplayName()}
                </Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="hidden sm:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <div className="space-y-3">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <Badge variant="outline" className={`${getRoleColor()} mt-1`}>
                  {getRoleDisplayName()}
                </Badge>
              </div>
              
              {getNavigationItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="px-4 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
