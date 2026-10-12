import { Link } from 'react-router'

const techniqueLinks = [
  { label: 'Basic Integration', to: '/learn?tech=basic' },
  { label: 'U-Substitution', to: '/learn?tech=u-substitution' },
  { label: 'Integration by Parts', to: '/learn?tech=parts' },
  { label: 'Trig Integrals', to: '/learn?tech=trigonometric' },
  { label: 'Trig Substitution', to: '/learn?tech=trig-substitution' },
  { label: 'Partial Fractions', to: '/learn?tech=partial-fractions' },
  { label: 'Improper Integrals', to: '/learn?tech=improper' },
  { label: 'Mixed Practice', to: '/learn?tech=mixed' },
]

const resourceLinks = [
  { label: 'Generator', to: '/generator' },
  { label: 'Practice Mode', to: '/practice' },
  { label: 'Learn', to: '/learn' },
  { label: 'About', to: '/about' },
]

const connectLinks = [
  { label: 'GitHub', to: '#' },
  { label: 'Report Issue', to: '#' },
  { label: 'Suggest Feature', to: '#' },
]

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1F1F1F] bg-[#050505]">
      <div className="container-mathgen pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="font-display text-[1.25rem] text-[#C9A86C]">∫</span>
              <span className="font-display text-[1.25rem] text-white">MathPivot</span>
            </Link>
            <p className="text-[0.875rem] text-[#8A8A8A] leading-relaxed">
              Free integration practice problems for calculus students.
            </p>
            <p className="text-[0.75rem] text-[#555555]">
              2025 MathPivot. Open source.
            </p>
          </div>

          {/* Techniques Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[0.875rem] font-semibold text-white uppercase tracking-wider">
              Techniques
            </h4>
            <ul className="flex flex-col gap-2.5">
              {techniqueLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#8A8A8A] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[0.875rem] font-semibold text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#8A8A8A] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[0.875rem] font-semibold text-white uppercase tracking-wider">
              Connect
            </h4>
            <ul className="flex flex-col gap-2.5">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[0.875rem] text-[#8A8A8A] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-[#1F1F1F] text-center">
          <p className="text-[0.75rem] text-[#555555]">
            2025 MathPivot. Built for calculus students everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
