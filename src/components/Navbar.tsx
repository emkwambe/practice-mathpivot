import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { SignInButton, SignUpButton, SignOutButton } from '@clerk/clerk-react'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/generator', label: 'Generator' },
  { to: '/practice', label: 'Practice' },
  { to: '/worksheets', label: 'Worksheets' },
  { to: '/learn', label: 'Learn' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  const authenticatedLinks = [
    { to: '/teacher', label: 'Teacher Dashboard' },
    { to: '/student/classes', label: 'My Classes' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-50 w-full h-[72px] border-b border-[#1F1F1F] bg-[rgba(5,5,5,0.85)] backdrop-blur-[12px]">
        <div className="container-mathgen h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <span className="font-display text-[1.25rem] text-[#C9A86C]">∫</span>
            <span className="font-display text-[1.25rem] text-white">MathPivot</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    relative text-[0.875rem] font-medium uppercase tracking-[0.08em] transition-colors duration-300
                    ${isActive ? 'text-white' : 'text-[#8A8A8A] hover:text-white'}
                  `}
                >
                  {link.label}
                  <span
                    className={`
                      absolute -bottom-1 left-0 h-[2px] bg-[#E30614] transition-all duration-300
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                    `}
                    style={{ width: isActive ? '100%' : undefined }}
                  />
                  {!isActive && (
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E30614] transition-all duration-300 hover:w-full" />
                  )}
                </Link>
              )
            })}
            {isAuthenticated &&
              authenticatedLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`
                      relative text-[0.875rem] font-medium uppercase tracking-[0.08em] transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-[#8A8A8A] hover:text-white'}
                    `}
                  >
                    {link.label}
                    <span
                      className={`
                        absolute -bottom-1 left-0 h-[2px] bg-[#E30614] transition-all duration-300
                        ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                      `}
                      style={{ width: isActive ? '100%' : undefined }}
                    />
                    {!isActive && (
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E30614] transition-all duration-300 hover:w-full" />
                    )}
                  </Link>
                )
              })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <SignOutButton>
                <button
                  type="button"
                  className="inline-flex items-center px-5 py-2 rounded-[6px] border border-[#1F1F1F] text-white text-[0.875rem] font-semibold hover:bg-[#1F1F1F] transition-colors duration-200"
                >
                  Sign Out
                </button>
              </SignOutButton>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex items-center px-5 py-2 rounded-[6px] border border-[#1F1F1F] text-white text-[0.875rem] font-semibold hover:bg-[#1F1F1F] transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="inline-flex items-center px-5 py-2 rounded-[6px] bg-[#E30614] text-white text-[0.875rem] font-semibold hover:bg-[#FF1A2E] transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-[#8A8A8A]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    text-2xl font-medium uppercase tracking-[0.08em] transition-all duration-300
                    ${isActive ? 'text-white' : 'text-[#8A8A8A] hover:text-white'}
                  `}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {link.label}
                </Link>
              )
            })}
            {isAuthenticated &&
              authenticatedLinks.map((link, i) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      text-2xl font-medium uppercase tracking-[0.08em] transition-all duration-300
                      ${isActive ? 'text-white' : 'text-[#8A8A8A] hover:text-white'}
                    `}
                    style={{ animationDelay: `${(navLinks.length + i) * 0.05}s` }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            {isAuthenticated ? (
              <SignOutButton>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 inline-flex items-center px-6 py-3 rounded-[8px] border border-[#1F1F1F] text-white text-[1rem] font-semibold hover:bg-[#1F1F1F] transition-colors duration-200"
                >
                  Sign Out
                </button>
              </SignOutButton>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-4">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center px-6 py-3 rounded-[8px] border border-[#1F1F1F] text-white text-[1rem] font-semibold hover:bg-[#1F1F1F] transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center px-6 py-3 rounded-[8px] bg-[#E30614] text-white text-[1rem] font-semibold hover:bg-[#FF1A2E] transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
