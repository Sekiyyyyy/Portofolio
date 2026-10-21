import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { ArrowUp, ArrowUpRight, Copy, Check } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(portfolioData.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="footer-section architectural-grid-subtle" id="contact">
      <div className="container">
        {/* Monumental Sign-off Headline */}
        <div style={{ marginBottom: '24px' }}>
          <span className="section-tag dark">// REACH OUT</span>
        </div>
        <h2 className="footer-heading">
          DONE .
        </h2>

        {/* Social Cards Grid */}
        <div className="social-links-grid">
          {/* Email Card with Quick Copy */}
          <div className="social-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="social-card-label">Direct Communication</span>
              <button
                onClick={handleCopyEmail}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? '#38BDF8' : '#71717A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            <a
              href={`mailto:${portfolioData.socials.email}`}
              className="social-card-val"
              style={{ textDecoration: 'none' }}
            >
              <span>{portfolioData.socials.email}</span>
              <ArrowUpRight size={18} color="#D96B27" />
            </a>
          </div>

          {/* GitHub Card */}
          <a
            href={portfolioData.socials.github}
            target="_blank"
            rel="noreferrer"
            className="social-card"
          >
            <span className="social-card-label">GitHub Source</span>
            <div className="social-card-val">
              <span>github.com/Sekiyyyyy</span>
              <ArrowUpRight size={18} color="#D96B27" />
            </div>
          </a>

          {/* LinkedIn Card */}
          <div className="social-card" style={{ cursor: 'default' }}>
            <span className="social-card-label">LinkedIn Profile</span>
            <div className="social-card-val">
              <span style={{ color: '#71717A', textTransform: 'uppercase' }}>
                {portfolioData.socials.linkedin}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#52525B' }}>
                [N/A]
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Lenis Scroll to Top */}
        <div className="footer-bottom-bar">
          <div>
            © 2026 {portfolioData.brand.first} {portfolioData.brand.second} • ALL RIGHTS RESERVED
          </div>

          <button
            onClick={onScrollToTop}
            className="magnetic-btn"
            style={{ padding: '10px 20px', fontSize: '0.75rem' }}
          >
            <span>BACK TO SUMMIT</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
