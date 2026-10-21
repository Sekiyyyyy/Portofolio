import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const MusicSection: React.FC = () => {
  const songs = portfolioData.songs;
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSong = songs[currentIdx] || songs[0];

  // Initialize and handle Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 30);
    };

    const onEnded = () => {
      // Auto-advance to next song
      setCurrentIdx((prev) => (prev + 1) % songs.length);
    };

    const onError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.src = '';
    };
  }, [songs.length]);

  // Handle active song source change
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const wasPlaying = isPlaying;

    audio.src = activeSong.audio;
    audio.currentTime = 0;
    setCurrentTime(0);

    if (wasPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentIdx, activeSong.audio]);

  // Volume & Mute sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSelectSong = (index: number) => {
    if (currentIdx === index) {
      togglePlay();
    } else {
      setCurrentIdx(index);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current
          ?.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }, 50);
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.music-player-bento', {
        y: -32,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      gsap.to('.playlist-editorial-table', {
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="music-section-wrap" id="music">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row" style={{ marginBottom: '40px' }}>
          <div>
            <span className="section-tag light">06 // MUSIC LOUNGE</span>
            <h2 className="music-main-title">FAVORITE SOUNDTRACKS</h2>
          </div>
        </div>

        {/* Vinyl Hi-Fi Studio Showcase: Deck + Interactive Playlist */}
        <div className="music-studio-layout">
          {/* LEFT: Featured Vinyl Player Console */}
          <div className="vinyl-player-card">
            {/* Card Top Status Bar */}
            <div className="player-card-top-bar">
              <span className="player-status-pill">
                <span className={`status-dot ${isPlaying ? 'dot-live' : ''}`} />
                <span>{isPlaying ? 'NOW PLAYING' : 'READY TO PLAY'}</span>
              </span>
              <span className="player-album-badge">{activeSong.album || 'ALBUM'}</span>
            </div>

            {/* Vinyl Record & Sleeve Assembly (Ultra-Smooth Fluid Slide) */}
            <div className="vinyl-assembly-area">
              {/* Outer Slider: Pure, buttery-smooth horizontal sliding without rotation conflict */}
              <div className={`vinyl-slide-track ${isPlaying ? 'is-slide-out' : ''}`}>
                {/* Inner Spinner: Independent continuous 360° spin, smoothly pauses without jump */}
                <div className={`vinyl-disc-spin ${isPlaying ? 'spin-running' : 'spin-paused'}`}>
                  <div className="vinyl-groove-rings" />
                  <div className="vinyl-specular-sheen" />
                  <div className="vinyl-center-badge">
                    <img src={activeSong.cover} alt="label" className="lp-label-thumb" />
                    <div className="lp-spindle-hole" />
                  </div>
                </div>
              </div>

              {/* Vinyl Sleeve with Cover Artwork */}
              <div className={`vinyl-sleeve-front ${isPlaying ? 'sleeve-active' : ''}`}>
                <img src={activeSong.cover} alt={activeSong.title} className="vinyl-cover-img" />
                <div className="sleeve-gloss" />

                {/* Floating Equalizer Wave */}
                {isPlaying && (
                  <div className="vinyl-live-equalizer">
                    <span className="bar bar-1" />
                    <span className="bar bar-2" />
                    <span className="bar bar-3" />
                    <span className="bar bar-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Currently Playing Metadata */}
            <div className="player-meta-block">
              <div className="player-track-info">
                <div className="player-title-row">
                  <h3 className="player-song-title" title={activeSong.title}>{activeSong.title}</h3>
                  {isPlaying && (
                    <div className="player-inline-eq" title="Audio Active">
                      <span className="eq-bar bar-1" />
                      <span className="eq-bar bar-2" />
                      <span className="eq-bar bar-3" />
                      <span className="eq-bar bar-4" />
                    </div>
                  )}
                </div>
                <p className="player-song-artist">{activeSong.artist}</p>
              </div>

              {/* Progress Scrubber */}
              <div className="player-timeline-box">
                <div className="player-time-labels">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || 30)}</span>
                </div>
                <div className="scrubber-track-container">
                  <div className="scrubber-fill-bar" style={{ width: `${progressPercent}%` }} />
                  <input
                    type="range"
                    min="0"
                    max={duration || 30}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="scrubber-slider-input"
                  />
                </div>
              </div>

              {/* Controls Toolbar */}
              <div className="player-controls-row">
                {/* Volume / Mute Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="player-tool-btn"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    style={{ width: '48px', accentColor: '#D96B27', cursor: 'pointer' }}
                    title="Adjust Volume"
                  />
                </div>

                {/* Prev / Play / Next */}
                <div className="player-playback-group">
                  <button type="button" onClick={handlePrev} className="player-nav-btn" title="Previous Song">
                    <SkipBack size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="player-main-play-btn"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={20} fill="#FFFFFF" /> : <Play size={20} fill="#FFFFFF" style={{ marginLeft: '2px' }} />}
                  </button>
                  <button type="button" onClick={handleNext} className="player-nav-btn" title="Next Song">
                    <SkipForward size={18} />
                  </button>
                </div>

                {/* Spinning Disc Indicator */}
                <div className={`disc-spin-indicator ${isPlaying ? 'spin-active' : ''}`} title="Playing Now">
                  <Disc3 size={18} color={isPlaying ? '#D96B27' : '#94A3B8'} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Curated Editorial Playlist Table */}
          <div className="playlist-editorial-table">
            <div className="playlist-table-header">
              <span style={{ width: '36px' }}>#</span>
              <span style={{ flex: 1 }}>TITLE / ARTIST</span>
              <span className="hidden-sm" style={{ width: '180px' }}>ALBUM</span>
              <span style={{ width: '60px', textAlign: 'right' }}>TIME</span>
            </div>

            <div className="playlist-items-scroll">
              {songs.map((song, idx) => {
                const isSelected = currentIdx === idx;
                const isItemPlaying = isSelected && isPlaying;

                return (
                  <div
                    key={song.id || idx}
                    onClick={() => handleSelectSong(idx)}
                    className={`playlist-item-row ${isSelected ? 'row-selected' : ''}`}
                  >
                    {/* Index or Equalizer / Play indicator */}
                    <div className="playlist-item-num">
                      {isItemPlaying ? (
                        <div className="row-mini-eq">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : (
                        <span className="num-text">0{idx + 1}</span>
                      )}
                      <Play size={13} className="hover-play-icon" />
                    </div>

                    {/* Artwork + Title & Artist */}
                    <div className="playlist-item-details">
                      <div className="playlist-mini-cover">
                        <img src={song.cover} alt={song.title} loading="lazy" />
                        {isItemPlaying && <div className="mini-cover-playing-ring" />}
                      </div>
                      <div className="playlist-names-wrap">
                        <span className={`row-track-title ${isSelected ? 'title-active' : ''}`}>
                          {song.title}
                        </span>
                        <span className="row-track-artist">{song.artist}</span>
                      </div>
                    </div>

                    {/* Album Name */}
                    <div className="playlist-item-album hidden-sm">
                      <span>{song.album || 'Single'}</span>
                    </div>

                    {/* Duration / Status */}
                    <div className="playlist-item-time">
                      <span>{song.duration || '3:30'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .music-section-wrap {
          padding: 130px 0;
          background-color: #F8FAFC;
          color: #0F172A;
          position: relative;
        }

        .music-main-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0F172A;
          line-height: 1.05;
          margin-top: 10px;
        }

        .music-header-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 8px 16px;
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 600;
          color: #475569;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .icon-pulse-active {
          color: #D96B27;
          animation: badge-pulse 1.5s ease-in-out infinite;
        }

        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }

        /* Split Layout */
        .music-studio-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }

        @media (min-width: 1024px) {
          .music-studio-layout {
            grid-template-columns: 340px 1fr;
            gap: 40px;
          }
        }

        /* LEFT: Vinyl Deck Console */
        .vinyl-player-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 22px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 90px;
        }

        .player-card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .player-status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.06em;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #94A3B8;
        }

        .status-dot.dot-live {
          background: #22C55E;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
          animation: dot-pulse 1.4s ease-in-out infinite;
        }

        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        /* ==========================================================================
           SMOOTH VINYL RECORD & SLEEVE ASSEMBLY
           ========================================================================== */
        .vinyl-assembly-area {
          position: relative;
          width: 210px;
          height: 165px;
          margin: 0 auto 18px auto;
          display: flex;
          align-items: center;
        }

        /* 1. Outer Slider: Handles ONLY the buttery-smooth physical sliding out */
        .vinyl-slide-track {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 152px;
          height: 152px;
          transform: translateX(0px);
          /* Ultra-smooth cubic bezier: fluid acceleration, natural deceleration */
          transition: transform 0.85s cubic-bezier(0.25, 1, 0.35, 1);
          z-index: 1;
          will-change: transform;
        }

        .vinyl-slide-track.is-slide-out {
          transform: translateX(46px);
        }

        /* 2. Inner Spinner: Handles ONLY the pure, continuous 360° rotation */
        .vinyl-disc-spin {
          width: 152px;
          height: 152px;
          border-radius: 50%;
          position: relative;
          background: radial-gradient(circle at 50% 50%, #20242E 0%, #0B0D13 75%);
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.45),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: vinyl-smooth-spin 3.8s linear infinite;
          animation-play-state: paused;
          will-change: transform;
        }

        .vinyl-disc-spin.spin-running {
          animation-play-state: running;
        }

        @keyframes vinyl-smooth-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .vinyl-groove-rings {
          position: absolute;
          inset: 5px;
          border-radius: 50%;
          background: repeating-radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.035) 0px,
            rgba(255, 255, 255, 0.035) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
        }

        .vinyl-specular-sheen {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 45deg at 50% 50%,
            rgba(255, 255, 255, 0.12) 0deg,
            transparent 55deg,
            rgba(255, 255, 255, 0.12) 180deg,
            transparent 235deg,
            rgba(255, 255, 255, 0.12) 360deg
          );
          pointer-events: none;
        }

        .vinyl-center-badge {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          border: 2px solid #D96B27;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
          z-index: 2;
        }

        .lp-label-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lp-spindle-hole {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #000000;
          border: 2px solid rgba(255, 255, 255, 0.45);
        }

        /* 3. Vinyl Sleeve (Album Cover) */
        .vinyl-sleeve-front {
          position: relative;
          width: 156px;
          height: 156px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
          z-index: 2;
          background: #1E293B;
          transform: perspective(700px) rotateY(0deg);
          transition: transform 0.65s cubic-bezier(0.25, 1, 0.35, 1), box-shadow 0.65s ease;
        }

        .vinyl-sleeve-front.sleeve-active {
          transform: perspective(700px) rotateY(-5deg) translateX(-3px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
        }

        .vinyl-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sleeve-gloss {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, transparent 60%);
          pointer-events: none;
        }

        .vinyl-live-equalizer {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          padding: 5px 7px;
          border-radius: 6px;
          display: flex;
          align-items: flex-end;
          gap: 2.5px;
          height: 18px;
        }

        .vinyl-live-equalizer .bar {
          width: 2.5px;
          background: #D96B27;
          border-radius: 2px;
          animation: eq-bounce 1s ease-in-out infinite alternate;
        }

        .vinyl-live-equalizer .bar-1 { height: 14px; animation-delay: 0.1s; }
        .vinyl-live-equalizer .bar-2 { height: 7px; animation-delay: 0.3s; }
        .vinyl-live-equalizer .bar-3 { height: 16px; animation-delay: 0.2s; }
        .vinyl-live-equalizer .bar-4 { height: 9px; animation-delay: 0.4s; }

        @keyframes eq-bounce {
          0% { height: 3px; }
          100% { height: 16px; }
        }

        /* Metadata & Title Row */
        .player-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .player-inline-eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .player-inline-eq .eq-bar {
          width: 2.5px;
          background: #D96B27;
          border-radius: 1px;
          animation: eq-inline-bounce 0.8s ease-in-out infinite alternate;
        }

        .player-inline-eq .bar-1 { height: 12px; animation-delay: 0.1s; }
        .player-inline-eq .bar-2 { height: 6px; animation-delay: 0.3s; }
        .player-inline-eq .bar-3 { height: 14px; animation-delay: 0.15s; }
        .player-inline-eq .bar-4 { height: 8px; animation-delay: 0.4s; }

        @keyframes eq-inline-bounce {
          0% { height: 3px; }
          100% { height: 14px; }
        }

        /* Player Metadata */
        .player-meta-block {
          text-align: center;
        }

        .player-album-badge {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #D96B27;
          background: rgba(217, 107, 39, 0.1);
          padding: 3px 10px;
          border-radius: 9999px;
          margin-bottom: 0;
        }

        .player-song-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-song-artist {
          font-family: var(--font-body);
          font-size: 0.84rem;
          color: #64748B;
          margin: 3px 0 14px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Timeline & Scrubber */
        .player-timeline-box {
          margin-bottom: 16px;
        }

        .player-time-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #64748B;
          margin-bottom: 5px;
        }

        .scrubber-track-container {
          position: relative;
          height: 5px;
          background: #E2E8F0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .scrubber-fill-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #D96B27;
          border-radius: 9999px;
          pointer-events: none;
        }

        .scrubber-slider-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        /* Controls Row */
        .player-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .player-tool-btn {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .player-tool-btn:hover {
          color: #0F172A;
          background: #F1F5F9;
        }

        .player-playback-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .player-nav-btn {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .player-nav-btn:hover {
          color: #D96B27;
          transform: scale(1.1);
        }

        .player-main-play-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #D96B27;
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(217, 107, 39, 0.4);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .player-main-play-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 10px 25px rgba(217, 107, 39, 0.55);
        }

        .disc-spin-indicator {
          padding: 8px;
          border-radius: 50%;
        }

        .disc-spin-indicator.spin-active svg {
          animation: spin-pulse 3s linear infinite;
        }

        @keyframes spin-pulse {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* RIGHT: Playlist Editorial Table */
        .playlist-editorial-table {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 24px 28px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }

        .playlist-table-header {
          display: flex;
          align-items: center;
          padding: 0 16px 14px 16px;
          border-bottom: 1px solid #E2E8F0;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #94A3B8;
        }

        .playlist-items-scroll {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
        }

        .playlist-item-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .playlist-item-row:hover {
          background: #F8FAFC;
          border-color: #E2E8F0;
          transform: translateX(4px);
        }

        .playlist-item-row.row-selected {
          background: #FFF7ED;
          border-color: #FFEDD5;
        }

        .playlist-item-num {
          width: 36px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .num-text {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 600;
          color: #94A3B8;
          transition: opacity 0.15s ease;
        }

        .hover-play-icon {
          position: absolute;
          left: 0;
          opacity: 0;
          color: #D96B27;
          transition: opacity 0.15s ease;
        }

        .playlist-item-row:hover .num-text {
          opacity: 0;
        }

        .playlist-item-row:hover .hover-play-icon {
          opacity: 1;
        }

        .row-mini-eq {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
        }

        .row-mini-eq span {
          width: 2px;
          background: #D96B27;
          border-radius: 1px;
          animation: mini-eq 0.8s ease-in-out infinite alternate;
        }

        .row-mini-eq span:nth-child(1) { height: 12px; animation-delay: 0.1s; }
        .row-mini-eq span:nth-child(2) { height: 6px; animation-delay: 0.3s; }
        .row-mini-eq span:nth-child(3) { height: 14px; animation-delay: 0.2s; }

        @keyframes mini-eq {
          0% { height: 3px; }
          100% { height: 14px; }
        }

        .playlist-item-details {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .playlist-mini-cover {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .playlist-mini-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mini-cover-playing-ring {
          position: absolute;
          inset: 0;
          border: 2px solid #D96B27;
          border-radius: 8px;
        }

        .playlist-names-wrap {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .row-track-title {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.95rem;
          color: #0F172A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .row-track-title.title-active {
          color: #D96B27;
          font-weight: 700;
        }

        .row-track-artist {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: #64748B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .playlist-item-album {
          width: 180px;
          font-family: var(--font-body);
          font-size: 0.84rem;
          color: #64748B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 12px;
        }

        .playlist-item-time {
          width: 60px;
          text-align: right;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: #94A3B8;
        }

        @media (max-width: 768px) {
          .hidden-sm {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default MusicSection;
