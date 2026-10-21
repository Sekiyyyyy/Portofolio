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

            {/* Hi-Fi Turntable Deck Console */}
            <div className="turntable-deck">
              {/* Turntable Platter & Vinyl Record */}
              <div className="turntable-platter-well">
                <div className={`turntable-vinyl ${isPlaying ? 'vinyl-spinning' : 'vinyl-paused'}`}>
                  {/* Concentric Vinyl Grooves */}
                  <div className="vinyl-groove-rings" />
                  {/* Specular Vinyl Light Reflection */}
                  <div className="vinyl-specular-sheen" />
                  {/* Center Album Artwork Label */}
                  <div className="vinyl-center-art">
                    <img src={activeSong.cover} alt={activeSong.title} className="vinyl-art-img" />
                    <div className="vinyl-spindle-core" />
                  </div>
                </div>
              </div>

              {/* Audiophile Mechanical Tonearm with Stylus */}
              <div className={`turntable-tonearm ${isPlaying ? 'tonearm-playing' : ''}`}>
                <div className="tonearm-pivot-base">
                  <div className="pivot-ring" />
                </div>
                <div className="tonearm-metal-rod">
                  <div className="tonearm-headshell">
                    <div className="tonearm-cartridge-tip" />
                  </div>
                </div>
              </div>

              {/* Deck Footer: Strobe Speed LED & Audio Specs */}
              <div className="turntable-deck-footer">
                <div className="turntable-speed-badge">
                  <span className={`speed-led ${isPlaying ? 'led-active' : ''}`} />
                  <span>33 ⅓ RPM</span>
                </div>
                <span className="turntable-brand">HI-FI DIRECT DRIVE</span>
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
           HI-FI TURNTABLE DECK CONSOLE
           ========================================================================== */
        .turntable-deck {
          position: relative;
          background: #0E121B;
          border-radius: 14px;
          padding: 14px 12px 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.08);
          margin-bottom: 18px;
          overflow: hidden;
        }

        .turntable-platter-well {
          position: relative;
          width: 176px;
          height: 176px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* 360° Smooth Fluid Spinning Vinyl Record */
        .turntable-vinyl {
          position: relative;
          width: 172px;
          height: 172px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, #262B38 0%, #0B0E14 75%);
          box-shadow: 
            0 10px 24px rgba(0, 0, 0, 0.6),
            inset 0 0 0 1px rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: turntable-spin 3.4s linear infinite;
          animation-play-state: paused;
          will-change: transform;
        }

        .turntable-vinyl.vinyl-spinning {
          animation-play-state: running;
        }

        @keyframes turntable-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Concentric Micro-grooves of the record */
        .vinyl-groove-rings {
          position: absolute;
          inset: 6px;
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

        /* Dual Specular Sheen (Real vinyl luster reflection) */
        .vinyl-specular-sheen {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 40deg at 50% 50%,
            rgba(255, 255, 255, 0.14) 0deg,
            transparent 50deg,
            rgba(255, 255, 255, 0.14) 180deg,
            transparent 230deg,
            rgba(255, 255, 255, 0.14) 360deg
          );
          pointer-events: none;
        }

        /* Center Album Art Label */
        .vinyl-center-art {
          position: relative;
          width: 66px;
          height: 66px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #D96B27;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
          z-index: 2;
        }

        .vinyl-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vinyl-spindle-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #090B10;
          border: 2px solid #E2E8F0;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.9);
        }

        /* Tonearm Assembly */
        .turntable-tonearm {
          position: absolute;
          top: 10px;
          right: 18px;
          width: 32px;
          height: 125px;
          transform-origin: 16px 12px;
          transform: rotate(0deg);
          transition: transform 0.65s cubic-bezier(0.2, 0.9, 0.3, 1);
          pointer-events: none;
          z-index: 10;
        }

        .turntable-tonearm.tonearm-playing {
          transform: rotate(25deg);
        }

        .tonearm-pivot-base {
          position: absolute;
          top: 0;
          left: 2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle, #F1F5F9 0%, #64748B 100%);
          border: 1px solid #475569;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tonearm-pivot-base .pivot-ring {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #0F172A;
          border: 1px solid #CBD5E1;
        }

        .tonearm-metal-rod {
          position: absolute;
          top: 13px;
          left: 13px;
          width: 3.5px;
          height: 86px;
          background: linear-gradient(90deg, #FFFFFF, #94A3B8, #475569);
          border-radius: 2px;
          box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.3);
        }

        .tonearm-headshell {
          position: absolute;
          bottom: -15px;
          left: -4px;
          width: 11px;
          height: 18px;
          background: #1E293B;
          border: 1px solid #475569;
          border-radius: 2px 2px 4px 4px;
          transform: rotate(-10deg);
        }

        .tonearm-cartridge-tip {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 5px;
          background: #D96B27;
          border-radius: 1px;
        }

        /* Turntable Footer */
        .turntable-deck-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 4px;
        }

        .turntable-speed-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .speed-led {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #64748B;
        }

        .speed-led.led-active {
          background: #22C55E;
          box-shadow: 0 0 6px #22C55E;
        }

        .turntable-brand {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: #64748B;
          letter-spacing: 0.1em;
          text-transform: uppercase;
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
