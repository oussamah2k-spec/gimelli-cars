import audiLogo from '../assets/brands/audi.svg';
import bmwLogo from '../assets/brands/bmw.svg';
import daciaLogo from '../assets/brands/dacia.svg';
import fordLogo from '../assets/brands/ford.svg';
import hondaLogo from '../assets/brands/honda.svg';
import hyundaiLogo from '../assets/brands/hyundai.svg';
import mercedesLogo from '../assets/brands/mercedes.svg';
import nissanLogo from '../assets/brands/nissan.svg';
import teslaLogo from '../assets/brands/tesla.svg';
import volkswagenLogo from '../assets/brands/volkswagen.svg';

const brands = [
  bmwLogo,
  mercedesLogo,
  audiLogo,
  daciaLogo,
  fordLogo,
  hyundaiLogo,
  nissanLogo,
  hondaLogo,
  teslaLogo,
  volkswagenLogo,
];

export default function Brands() {
  return (
    <section style={{ padding: '32px 20px 60px', background: '#000' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '18px',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {brands.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            style={{
              background: '#0d0d0d',
              minHeight: '84px',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              loading="lazy"
              style={{
                width: '100%',
                height: '40px',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}