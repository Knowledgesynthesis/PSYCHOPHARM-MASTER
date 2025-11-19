import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Pill, Brain, Activity, Heart, Zap, Moon, Beaker, FileText, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const location = useLocation();

  const navLinks = {
    modules: [
      { to: '/antidepressants', label: 'Antidepressants', icon: Pill },
      { to: '/mood-stabilizers', label: 'Mood Stabilizers', icon: Activity },
      { to: '/antipsychotics', label: 'Antipsychotics', icon: Brain },
      { to: '/anxiety-agents', label: 'Anxiety Agents', icon: Heart },
      { to: '/adhd', label: 'ADHD & Stimulants', icon: Zap },
      { to: '/sleep-meds', label: 'Sleep Medications', icon: Moon },
      { to: '/substance-use', label: 'Substance Use', icon: Beaker },
    ],
    tools: [
      { to: '/mechanism-visualizer', label: 'Mechanism Visualizer' },
      { to: '/side-effect-recognizer', label: 'Side Effect Recognizer' },
      { to: '/drug-comparison', label: 'Drug Comparison' },
      { to: '/switching-simulator', label: 'Switching Simulator' },
    ],
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-bold">Psychopharm Master</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={cn(
                'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-500',
                isActive('/') ? 'text-primary-500' : 'text-muted-foreground'
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {/* Modules Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary-500">
                <span>Modules</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-card border rounded-lg shadow-lg p-2">
                {navLinks.modules.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent',
                      isActive(link.to) ? 'bg-accent text-primary-500' : 'text-foreground'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary-500">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-card border rounded-lg shadow-lg p-2">
                {navLinks.tools.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'block px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent',
                      isActive(link.to) ? 'bg-accent text-primary-500' : 'text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/assessment"
              className={cn(
                'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-500',
                isActive('/assessment') ? 'text-primary-500' : 'text-muted-foreground'
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Assessment</span>
            </Link>

            <Link
              to="/settings"
              className={cn(
                'flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary-500',
                isActive('/settings') ? 'text-primary-500' : 'text-muted-foreground'
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <nav className="container mx-auto px-4 py-4 space-y-1">
              <Link
                to="/"
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive('/') ? 'bg-accent text-primary-500' : 'hover:bg-accent'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              {/* Modules Section */}
              <div>
                <button
                  onClick={() => setIsModulesOpen(!isModulesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                >
                  <span>Modules</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isModulesOpen && 'rotate-180')} />
                </button>
                {isModulesOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {navLinks.modules.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={cn(
                          'flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors',
                          isActive(link.to) ? 'bg-accent text-primary-500' : 'hover:bg-accent'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Tools Section */}
              <div>
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                >
                  <span>Tools</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isToolsOpen && 'rotate-180')} />
                </button>
                {isToolsOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {navLinks.tools.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={cn(
                          'block px-3 py-2 rounded-md text-sm transition-colors',
                          isActive(link.to) ? 'bg-accent text-primary-500' : 'hover:bg-accent'
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/assessment"
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive('/assessment') ? 'bg-accent text-primary-500' : 'hover:bg-accent'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                <span>Assessment</span>
              </Link>

              <Link
                to="/settings"
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive('/settings') ? 'bg-accent text-primary-500' : 'hover:bg-accent'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Psychopharm Master. For educational purposes only.</p>
          <p className="mt-1">Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
