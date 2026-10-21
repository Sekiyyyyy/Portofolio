import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onNavigate: (targetId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Always show at top of page
      if (currentScrollY <= 60) {
        setVisible(true);
      } else {
        const delta = currentScrollY - lastScrollY.current;
        // Scrolling DOWN -> Hide
        if (delta > 6) {
          setVisible(false);
        }
        // Scrolling UP -> Show
        else if (delta < -6) {
          setVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', target: '#about' },
    { label: 'Work', target: '#projects' },
    { label: 'Moments', target: '#moments' },
    { label: 'Journey', target: '#journey' },
    { label: 'GitHub', target: '#github' },
    { label: 'Music', target: '#music' },
  ];

  return (
    <header className={`navbar-fixed-wrapper ${visible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className={`navbar-compact-pill ${scrolled ? 'navbar-scrolled' : ''}`}>
        
        {/* Luxury Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#home');
          }}
          className="navbar-brand-link"
        >
          <span className="brand-dot-pulse" />
          <span className="brand-name">RIZKY</span>
          <span className="brand-accent">.</span>
        </a>

        {/* Minimalist Vertical Divider */}
        <span className="navbar-divider" />

        {/* Center Minimalist Navigation Links */}
        <nav className="navbar-links-group">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.target);
              }}
              className="navbar-link"
            >
              {link.label}
            </a>
          ))}
        </nav>

      </div>

      <style>{`
        .navbar-fixed-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          padding: 16px 20px;
          display: flex;
          justify-content: center;
          pointer-events: none;
          transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .navbar-visible {
          transform: translateY(0);
          opacity: 1;
        }

        .navbar-hidden {
          transform: translateY(-120%);
          opacity: 0;
        }

        /* Compact Cohesive Pill with Comfortable Space */
        .navbar-compact-pill {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 20px;
          padding: 9px 24px 9px 18px;
          border-radius: 9999px;
          background: rgba(10, 14, 23, 0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: all 0.3s ease;
        }

        .navbar-scrolled {
          background: rgba(7, 9, 14, 0.92);
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow: 0 14px 42px rgba(0, 0, 0, 0.65);
          padding: 8px 22px 8px 16px;
        }

        /* High-End Brand Styling */
        .navbar-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          user-select: none;
          padding: 4px 6px;
          transition: transform 0.2s ease;
        }
        .navbar-brand-link:hover {
          transform: translateY(-0.5px);
        }

        .brand-dot-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #D96B27;
          box-shadow: 0 0 8px rgba(217, 107, 39, 0.9);
          transition: all 0.25s ease;
        }
        .navbar-brand-link:hover .brand-dot-pulse {
          box-shadow: 0 0 14px #D96B27;
          transform: scale(1.2);
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: 1.08rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #FFFFFF 50%, #FFB07D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-accent {
          font-family: var(--font-display);
          font-size: 1.08rem;
          font-weight: 800;
          color: #D96B27;
          margin-left: -1px;
        }

        /* Subtle Vertical Divider */
        .navbar-divider {
          width: 1px;
          height: 18px;
          background: rgba(255, 255, 255, 0.14);
          margin: 0 4px;
        }

        /* Links with Relaxed Spacing */
        .navbar-links-group {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-link {
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          letter-spacing: -0.01em;
          padding: 6px 4px;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .navbar-link:hover {
          color: #FFFFFF;
        }

        @media (max-width: 640px) {
          .navbar-links-group {
            gap: 14px;
          }
          .navbar-link {
            font-size: 0.78rem;
            padding: 4px 2px;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
