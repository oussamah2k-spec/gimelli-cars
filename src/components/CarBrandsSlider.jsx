import { memo, useEffect, useMemo, useRef, useState } from 'react';

const logos = [
  '/brands/bmw.svg',
  '/brands/audi.svg',
  '/brands/tesla.svg',
  '/brands/volkswagen.svg',
  '/brands/honda.svg',
  '/brands/nissan.svg',
  '/brands/hyundai.svg',
  '/brands/ford.svg',
];

function CarBrandsSlider() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(true);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)');
    const updateMotionPreference = () => {
      setCanAnimate(mediaQuery.matches);
    };

    updateMotionPreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMotionPreference);
    } else {
      mediaQuery.addListener(updateMotionPreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMotionPreference);
      } else {
        mediaQuery.removeListener(updateMotionPreference);
      }
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const shouldAnimate = canAnimate && isInView;
  const sliderLogos = useMemo(() => (shouldAnimate ? [...logos, ...logos] : logos), [shouldAnimate]);

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        padding: '24px 0',
        background: 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          width: 'max-content',
          animation: shouldAnimate ? 'carBrandsSliderScroll 36s linear infinite' : 'none',
          willChange: shouldAnimate ? 'transform' : 'auto',
        }}
      >
        {sliderLogos.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            style={{
              flex: '0 0 auto',
              width: '132px',
              minWidth: '132px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={logo}
                alt="Brand logo"
                loading="lazy"
                decoding="async"
                draggable="false"
                style={{
                  display: 'block',
                  width: 'auto',
                  maxWidth: '100%',
                  height: '40px',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes carBrandsSliderScroll {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}

export default memo(CarBrandsSlider);