import React from 'react';

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const techMap: Record<string, string> = {
  laravel: '/tech/laravel.svg',
  react: '/tech/react.svg',
  reactjs: '/tech/react.svg',
  typescript: '/tech/typescript.svg',
  ts: '/tech/typescript.svg',
  tailwind: '/tech/tailwind.svg',
  tailwindcss: '/tech/tailwind.svg',
  nextjs: '/tech/nextjs.svg',
  next: '/tech/nextjs.svg',
  nextdotjs: '/tech/nextjs.svg',
  flutter: '/tech/flutter.svg',
  dart: '/tech/dart.svg',
  go: '/tech/go.svg',
  golang: '/tech/go.svg',
  postgresql: '/tech/postgresql.svg',
  postgres: '/tech/postgresql.svg',
  mysql: '/tech/mysql.svg',
  php: '/tech/php.svg',
  git: '/tech/git.svg',
  github: '/tech/git.svg',
  gsap: '/tech/gsap.svg',
  threejs: '/tech/threejs.svg',
  three: '/tech/threejs.svg',
  framermotion: '/tech/framer.svg',
  framer: '/tech/framer.svg',
};

export const TechIcon: React.FC<TechIconProps> = ({
  name,
  size = 24,
  className = '',
  style = {},
}) => {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const src = techMap[norm];

  if (!src) {
    return (
      <span
        className={`inline-flex items-center justify-center font-mono font-bold text-xs ${className}`}
        style={{ width: size, height: size, ...style }}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      loading="lazy"
    />
  );
};

export default TechIcon;
