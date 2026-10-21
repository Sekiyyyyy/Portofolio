import React from 'react';
import { TiltedGridHero } from '@/components/ui/tilted-grid-hero';

import foto1 from '@/assets/foto (1).jpeg';
import foto2 from '@/assets/foto (2).jpeg';
import foto3 from '@/assets/foto (3).jpeg';
import foto4 from '@/assets/foto (4).jpeg';
import foto5 from '@/assets/foto (5).jpeg';
import foto6 from '@/assets/foto (6).jpeg';

const MOMENT_IMAGES = [
  {
    src: foto1,
    alt: 'Documented Moment 1',
  },
  {
    src: foto2,
    alt: 'Documented Moment 2',
  },
  {
    src: foto3,
    alt: 'Documented Moment 3',
  },
  {
    src: foto4,
    alt: 'Documented Moment 4',
  },
  {
    src: foto5,
    alt: 'Documented Moment 5',
  },
  {
    src: foto6,
    alt: 'Documented Moment 6',
  },
];

export const DocumentedMoments: React.FC = () => {
  return (
    <section
      className="architectural-grid-subtle"
      style={{
        position: 'relative',
        padding: '120px 0 100px',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
      id="moments"
    >
      <div className="container" style={{ marginBottom: '36px' }}>
        <div className="section-header-row" style={{ marginBottom: '16px' }}>
          <div>
            <span className="section-tag dark">// MOMENTS</span>
            <h2 className="section-title">DOCUMENTED MOMENTS</h2>
          </div>
        </div>
      </div>

      {/* 3D Tilted Curved Cylinder Reel with 16:9 Cropped Aspect Ratio */}
      <div style={{ width: '100%', position: 'relative' }}>
        <TiltedGridHero
          images={MOMENT_IMAGES}
          speed={4.5}
          tileHeight={34}
          aspectRatio={16 / 9}
          gap={22}
          curve={75}
          fade={14}
          className="h-[520px] w-full"
        />
      </div>
    </section>
  );
};

export default DocumentedMoments;
