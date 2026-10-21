import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import ContributionSkylineComponent from '@/components/ui/contribution-skyline';
import type { ContributionDay } from '@/components/ui/contribution-skyline';
import realContributions from '../data/githubContributions.json';
import { GitBranch, Users, UserCheck, ArrowUpRight, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OctocatIcon: React.FC<{ size?: number; className?: string }> = ({ size = 56, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

// Private repository contributions map (AppUjian, etc.) to match real profile total (207 contributions)
const PRIVATE_CONTRIBUTIONS_BY_DATE: Record<string, number> = {
  "2026-09-15": 1,
  "2026-09-16": 2,
  "2026-09-17": 3,
  "2026-09-18": 1,
  "2026-09-19": 2,
  "2026-09-22": 4,
  "2026-09-23": 1,
  "2026-09-24": 8,
  "2026-09-26": 5,
  "2026-09-27": 10,
  "2026-09-28": 6,
  "2026-09-29": 5,
  "2026-09-30": 9,
  "2026-10-01": 6,
  "2026-10-02": 4,
  "2026-10-09": 2,
  "2026-10-10": 9,
  "2026-10-11": 2,
  "2026-10-12": 8,
  "2026-10-13": 1,
};

export const ContributionSkyline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [contributionsData, setContributionsData] = useState<ContributionDay[]>(realContributions as ContributionDay[]);
  const [stats, setStats] = useState({
    repos: portfolioData.github.repos.replace(/\D/g, '') || '10',
    followers: portfolioData.github.followers.replace(/\D/g, '') || '8',
    following: portfolioData.github.following.replace(/\D/g, '') || '9',
    commitsText: portfolioData.github.contributions,
    avatarUrl: 'https://avatars.githubusercontent.com/u/212300626?v=4',
  });

  useEffect(() => {
    // Live fetch GitHub profile metadata
    fetch(`https://api.github.com/users/${portfolioData.github.username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.login) {
          const privateCount = (portfolioData.github as any).privateRepos ?? 2;
          setStats((prev) => ({
            ...prev,
            repos: String(data.public_repos != null ? data.public_repos + privateCount : prev.repos),
            followers: String(data.followers ?? prev.followers),
            following: String(data.following ?? prev.following),
            avatarUrl: data.avatar_url || prev.avatarUrl,
          }));
        }
      })
      .catch(() => {});

    // Live fetch real GitHub contributions
    fetch(`https://github-contributions-api.jogruber.de/v4/${portfolioData.github.username}?y=last`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
          const formatted: ContributionDay[] = data.contributions.map((c: any) => {
            const privateCnt = PRIVATE_CONTRIBUTIONS_BY_DATE[c.date] || 0;
            return {
              date: c.date,
              count: (Number(c.count) || 0) + privateCnt,
            };
          });
          setContributionsData(formatted);
          const totalContributions = formatted.reduce((acc: number, cur: ContributionDay) => acc + (cur.count || 0), 0);
          setStats((prev) => ({
            ...prev,
            commitsText: `${totalContributions} contributions in the last year`,
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on section background elements
      gsap.to('.github-watermark-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // Stagger entrance for floating accents
      gsap.fromTo('.gh-floating-accent', {
        opacity: 0,
        scale: 0.5,
        y: 40,
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Heading reveal
      gsap.fromTo(headingRef.current, {
        opacity: 0,
        y: 50,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      // Card entrance
      gsap.fromTo(cardRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.97,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="gh-section architectural-grid-subtle"
      id="github"
    >
      {/* Atmospheric Background Layers */}
      <div className="gh-atmosphere" aria-hidden="true">
        <div className="gh-glow gh-glow-1" />
        <div className="gh-glow gh-glow-2" />
        <div className="gh-glow gh-glow-3" />
      </div>

      {/* Giant Faded Watermark */}
      <div className="github-watermark-bg" aria-hidden="true">
        GITHUB
      </div>

      {/* Floating Geometric Accents — true 3D isometric cubes */}
      <div className="gh-floating-accent gh-accent-1" aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          <path d="M36 4L66 20V52L36 68L6 52V20L36 4Z" stroke="#38BDF8" strokeWidth="1.5" opacity="0.35" />
          <path d="M6 20L36 36L66 20" stroke="#38BDF8" strokeWidth="1.5" opacity="0.2" />
          <path d="M36 36V68" stroke="#38BDF8" strokeWidth="1.5" opacity="0.2" />
        </svg>
      </div>
      <div className="gh-floating-accent gh-accent-2" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="6" width="36" height="36" rx="8" fill="rgba(217,107,39,0.12)" stroke="rgba(217,107,39,0.4)" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="gh-floating-accent gh-accent-3" aria-hidden="true">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="28" cy="28" r="12" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </svg>
      </div>
      <div className="gh-floating-accent gh-accent-4" aria-hidden="true">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M21 2L38 12V32L21 42L4 32V12L21 2Z" stroke="#A78BFA" strokeWidth="1.5" opacity="0.3" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div ref={headingRef} className="gh-header">
          <div className="gh-tag-row">
            <span className="section-tag dark">05 // CODE & REPOSITORIES</span>
          </div>

          <div className="gh-title-row">
            <div className="gh-title-group">
              <h2 className="gh-heading">
                <span className="gh-heading-solid">GITHUB</span>
                <span className="gh-heading-outline">ACTIVITY</span>
              </h2>
              <div className="gh-octocat-mark">
                <OctocatIcon size={36} className="gh-octocat-svg" />
              </div>
            </div>

            <a
              href={portfolioData.github.url}
              target="_blank"
              rel="noreferrer"
              className="gh-profile-link"
            >
              <span>VIEW PROFILE</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        {/* Main Bento Card */}
        <div ref={cardRef} className="gh-card">
          {/* Subtle top-edge gradient accent line */}
          <div className="gh-card-accent-line" aria-hidden="true" />

          {/* Profile Header Row */}
          <div className="gh-profile-row">
            <div className="gh-user-info">
              {/* Avatar */}
              <div className="gh-avatar-wrap">
                <img
                  src={stats.avatarUrl}
                  alt={portfolioData.github.name}
                  className="gh-avatar-img"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add('gh-avatar-fallback');
                    }
                  }}
                />
                <span className="gh-online-pulse" />
                <span className="gh-online-dot" />
              </div>

              {/* User Text */}
              <div className="gh-user-text">
                <div className="gh-user-name-row">
                  <h3 className="gh-user-name">{portfolioData.github.name}</h3>
                  <span className="gh-active-badge">
                    <Activity size={11} />
                    <span>ACTIVE</span>
                  </span>
                </div>
                <div className="gh-user-handle">
                  <span className="gh-handle-aka">a.k.a Rizky</span>
                  <span className="gh-handle-dot">•</span>
                  <a
                    href={portfolioData.github.url}
                    target="_blank"
                    rel="noreferrer"
                    className="gh-handle-link"
                  >
                    @{portfolioData.github.username}
                  </a>
                  <span className="gh-handle-dot">•</span>
                  <span className="gh-user-role">{portfolioData.github.role}</span>
                </div>
              </div>
            </div>

            {/* Stat Pills */}
            <div className="gh-stats-row">
              <a
                href={`${portfolioData.github.url}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="gh-stat-pill"
              >
                <GitBranch size={15} className="gh-pill-icon gh-stat-cyan" />
                <span className="gh-pill-text">
                  <span className="gh-pill-num">{stats.repos}</span>
                  <span className="gh-pill-label">REPOS</span>
                </span>
              </a>
              <a
                href={`${portfolioData.github.url}?tab=followers`}
                target="_blank"
                rel="noreferrer"
                className="gh-stat-pill"
              >
                <Users size={15} className="gh-pill-icon gh-stat-green" />
                <span className="gh-pill-text">
                  <span className="gh-pill-num">{stats.followers}</span>
                  <span className="gh-pill-label">FOLLOWERS</span>
                </span>
              </a>
              <a
                href={`${portfolioData.github.url}?tab=following`}
                target="_blank"
                rel="noreferrer"
                className="gh-stat-pill"
              >
                <UserCheck size={15} className="gh-pill-icon gh-stat-purple" />
                <span className="gh-pill-text">
                  <span className="gh-pill-num">{stats.following}</span>
                  <span className="gh-pill-label">FOLLOWING</span>
                </span>
              </a>
            </div>
          </div>

          {/* Contribution Heatmap — Inner Container */}
          <div className="gh-heatmap-container">
            <ContributionSkylineComponent
              data={contributionsData}
              defaultView="2d"
              palette="github"
              title={
                <div className="gh-commit-title-wrap">
                  <span className="gh-commit-dot" />
                  <span className="gh-commit-title">
                    {stats.commitsText}
                  </span>
                </div>
              }
              heightScale={1.1}
              className="gh-skyline-skin"
            />
          </div>
        </div>
      </div>

      <style>{`
        /* ============================================
           GITHUB ACTIVITY SECTION — PREMIUM DARK
           ============================================ */

        .gh-section {
          padding: 160px 0 150px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          overflow: hidden;
          scroll-margin-top: 110px;
        }

        /* Atmospheric Glow Orbs */
        .gh-atmosphere {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .gh-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.5;
        }

        .gh-glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(57, 211, 83, 0.08) 0%, transparent 70%);
          top: -80px;
          right: -100px;
        }

        .gh-glow-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%);
          bottom: 60px;
          left: -80px;
        }

        .gh-glow-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.05) 0%, transparent 70%);
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Background Watermark */
        .github-watermark-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: clamp(7rem, 20vw, 18rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.03);
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
          z-index: 1;
        }

        /* Floating Geometric Accents */
        .gh-floating-accent {
          position: absolute;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .gh-accent-1 {
          top: 8%;
          left: 3%;
          animation: ghFloat 10s ease-in-out infinite alternate;
        }

        .gh-accent-2 {
          bottom: 15%;
          left: 5%;
          animation: ghFloat 8s ease-in-out 0.5s infinite alternate-reverse;
        }

        .gh-accent-3 {
          top: 12%;
          right: 4%;
          animation: ghFloat 12s ease-in-out 1s infinite alternate;
        }

        .gh-accent-4 {
          bottom: 20%;
          right: 6%;
          animation: ghFloat 9s ease-in-out 1.5s infinite alternate-reverse;
        }

        @keyframes ghFloat {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(8deg); }
        }

        /* Section Header */
        .gh-header {
          margin-bottom: 42px;
        }

        .gh-tag-row {
          margin-bottom: 14px;
        }

        .gh-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .gh-title-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .gh-heading {
          font-family: 'Plus Jakarta Sans', var(--font-body, sans-serif);
          font-size: clamp(1.8rem, 3.2vw, 2.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.015em;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .gh-heading-solid {
          color: #FFFFFF;
        }

        .gh-heading-outline {
          color: #080808;
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.7);
          paint-order: stroke fill;
          transition: all 0.3s ease;
        }

        .gh-section:hover .gh-heading-outline {
          -webkit-text-stroke-color: rgba(255, 255, 255, 0.95);
        }

        .gh-octocat-mark {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gh-octocat-mark:hover {
          color: rgba(255, 255, 255, 0.5);
          transform: scale(1.1) rotate(6deg);
        }

        .gh-profile-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #CBD5E1;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }

        .gh-profile-link:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        /* ====== MAIN BENTO CARD ====== */
        .gh-card {
          position: relative;
          background: linear-gradient(145deg, #0C1018 0%, #0A0E16 50%, #080C14 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.04),
            0 24px 60px -12px rgba(0, 0, 0, 0.7),
            0 48px 100px -24px rgba(0, 0, 0, 0.5);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .gh-card:hover {
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow:
            0 2px 0 rgba(255, 255, 255, 0.06),
            0 32px 72px -12px rgba(0, 0, 0, 0.8),
            0 56px 120px -24px rgba(0, 0, 0, 0.6);
        }

        /* Top accent gradient line */
        .gh-card-accent-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(57, 211, 83, 0.4) 20%,
            rgba(56, 189, 248, 0.5) 50%,
            rgba(167, 139, 250, 0.4) 80%,
            transparent 100%
          );
          z-index: 3;
        }

        /* ====== PROFILE ROW ====== */
        .gh-profile-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 22px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        @media (min-width: 900px) {
          .gh-profile-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 22px 34px;
          }
        }

        @media (max-width: 768px) {
          .gh-profile-row {
            padding: 18px 20px;
          }
        }

        .gh-user-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Avatar */
        .gh-avatar-wrap {
          position: relative;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .gh-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          transition: border-color 0.3s ease;
        }

        .gh-avatar-wrap:hover .gh-avatar-img {
          border-color: rgba(57, 211, 83, 0.4);
        }

        .gh-avatar-fallback {
          background: #161B22;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.12);
        }

        .gh-avatar-fallback::before {
          content: 'RA';
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.1rem;
          color: #D96B27;
        }

        /* Online Indicator with pulse */
        .gh-online-pulse {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.4);
          animation: onlinePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .gh-online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22C55E;
          border: 2px solid #0C1018;
        }

        @keyframes onlinePing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* User Text */
        .gh-user-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .gh-user-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gh-user-name {
          font-family: var(--font-display, 'Syne', sans-serif);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #F1F5F9;
          line-height: 1.2;
          margin: 0;
        }

        .gh-active-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 9999px;
          background: rgba(57, 211, 83, 0.1);
          border: 1px solid rgba(57, 211, 83, 0.2);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #4ADE80;
        }

        .gh-user-handle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #64748B;
          margin-top: 2px;
          flex-wrap: wrap;
        }

        .gh-handle-aka {
          color: #94A3B8;
        }

        .gh-handle-dot {
          color: #334155;
          font-size: 0.65rem;
        }

        .gh-handle-link {
          color: #64748B;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .gh-handle-link:hover {
          color: #38BDF8;
        }

        .gh-user-role {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: #94A3B8;
          letter-spacing: 0.02em;
        }

        /* Stat Pills */
        .gh-stats-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .gh-stat-pill {
          display: inline-flex;
          align-items: center;
          height: 36px;
          padding: 0 16px;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          font-family: var(--font-mono);
          text-decoration: none;
          color: #CBD5E1;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          box-sizing: border-box;
        }

        .gh-stat-pill:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        }

        .gh-pill-icon {
          flex-shrink: 0;
          display: block;
        }

        .gh-stat-cyan { color: #38BDF8; }
        .gh-stat-green { color: #39D353; }
        .gh-stat-purple { color: #A78BFA; }

        .gh-pill-text {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          line-height: 1;
        }

        .gh-pill-num {
          font-family: var(--font-mono);
          font-weight: 800;
          color: #F1F5F9;
          font-size: 0.85rem;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .gh-pill-label {
          font-family: var(--font-mono);
          color: #64748B;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          font-weight: 600;
          line-height: 1;
          text-transform: uppercase;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* ====== HEATMAP CONTAINER ====== */
        .gh-heatmap-container {
          padding: 0;
          position: relative;
        }

        .gh-commit-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gh-commit-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #39D353;
          box-shadow: 0 0 10px rgba(57, 211, 83, 0.6);
          animation: commitPulse 2s ease-in-out infinite;
        }

        @keyframes commitPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.15); box-shadow: 0 0 14px rgba(57, 211, 83, 0.9); }
        }

        .gh-commit-title {
          font-family: var(--font-mono);
          font-size: 0.88rem;
          font-weight: 600;
          color: #CBD5E1;
          letter-spacing: 0.02em;
        }

        /* 21st.dev Skyline — Dark Theme Override */
        .gh-skyline-skin {
          --color-background: transparent !important;
          --color-foreground: #F1F5F9 !important;
          --color-border: rgba(255, 255, 255, 0.06) !important;
          --color-muted-foreground: #64748B !important;
          background: transparent !important;
          color: #F1F5F9 !important;
          border: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }

        /* Inner bordered container */
        .gh-skyline-skin > div.relative {
          border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: none !important;
          border-radius: 0 0 24px 24px !important;
          background: transparent !important;
        }

        .gh-skyline-skin header {
          padding: 16px 34px 14px 34px !important;
          margin-bottom: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          flex-wrap: wrap !important;
          gap: 16px !important;
        }

        @media (max-width: 768px) {
          .gh-skyline-skin header {
            padding: 14px 20px 12px 20px !important;
          }
        }

        /* Canvas area padding */
        .gh-skyline-skin > div.relative > div.relative {
          padding: 20px 34px 18px 34px !important;
        }

        @media (max-width: 768px) {
          .gh-skyline-skin > div.relative > div.relative {
            padding: 16px 20px 14px 20px !important;
          }
        }

        /* Stat grid padding */
        .gh-skyline-skin .grid.grid-cols-2 {
          padding: 24px 34px 22px 34px !important;
          gap: 24px 36px !important;
        }

        @media (max-width: 768px) {
          .gh-skyline-skin .grid.grid-cols-2 {
            padding: 18px 20px 18px 20px !important;
            gap: 18px 16px !important;
          }
        }

        /* Stat items spacing */
        .gh-stat-item {
          display: flex;
          flex-direction: column;
        }

        .gh-stat-item .gh-stat-label {
          font-family: var(--font-mono) !important;
          font-size: 0.72rem !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          color: #64748B !important;
          font-weight: 600 !important;
          margin-bottom: 10px !important;
        }

        .gh-stat-main {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px !important;
        }

        .gh-stat-val {
          font-family: var(--font-mono) !important;
          font-size: 1.85rem !important;
          font-weight: 800 !important;
          line-height: 1 !important;
          letter-spacing: -0.02em !important;
          color: #39D353 !important;
        }

        .gh-stat-unit {
          font-family: var(--font-mono) !important;
          font-size: 0.8rem !important;
          color: #94A3B8 !important;
          font-weight: 500 !important;
        }

        .gh-stat-sub {
          font-family: var(--font-mono) !important;
          font-size: 0.72rem !important;
          color: #64748B !important;
          letter-spacing: 0.02em !important;
          line-height: 1.4 !important;
        }

        /* Footer area */
        .gh-skyline-skin div[class*="justify-between"] {
          padding: 16px 34px !important;
          font-family: var(--font-mono) !important;
          font-size: 0.72rem !important;
          color: #475569 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
        }

        @media (max-width: 768px) {
          .gh-skyline-skin div[class*="justify-between"] {
            padding: 14px 20px !important;
          }
        }

        /* Tooltip — Premium GitHub Dark Style */
        .gh-skyline-skin [role="tooltip"] {
          font-family: var(--font-mono), var(--font-body), sans-serif !important;
          background: #090D16 !important;
          color: #F8FAFC !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 8px !important;
          padding: 7px 12px !important;
          font-size: 0.78rem !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 12px rgba(57, 211, 83, 0.15) !important;
          backdrop-filter: blur(10px) !important;
          z-index: 50 !important;
          pointer-events: none !important;
        }

        .gh-skyline-skin [role="tooltip"] strong {
          color: #38BDF8 !important;
          font-weight: 700 !important;
          margin-right: 4px !important;
        }

        .gh-skyline-skin [role="tooltip"] span:not([aria-hidden="true"]) {
          color: #CBD5E1 !important;
          opacity: 1 !important;
        }

        .gh-skyline-skin [role="tooltip"] span[aria-hidden="true"] {
          border-top: 5px solid #090D16 !important;
          border-left: 5px solid transparent !important;
          border-right: 5px solid transparent !important;
        }

        /* Legend swatches */
        .gh-skyline-skin button[class*="h-3"] {
          border-radius: 3px !important;
        }
      `}</style>
    </section>
  );
};

export default ContributionSkyline;
