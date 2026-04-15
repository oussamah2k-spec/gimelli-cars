import {
  FaFacebookF,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa';

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gimelli_car',
    icon: FaInstagram,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/share/18VWtKQc4s',
    icon: FaFacebookF,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@gimellicar',
    icon: FaTiktok,
  },
  {
    name: 'Email',
    href: 'mailto:Gimellicar7@gmail.com',
    icon: FaEnvelope,
  },
];

function SocialIcons() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
          {SOCIAL_LINKS.map((item) => {
            const Icon = item.icon;
            const isMail = item.href.startsWith('mailto:');

            return (
              <a
                key={item.name}
                href={item.href}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noreferrer'}
                aria-label={item.name}
                className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#D4AF37]/35 bg-[#0B0B0B] text-white shadow-[0_12px_26px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#D4AF37] hover:text-[#F5D97A] hover:shadow-[0_0_0_1px_rgba(212,175,55,0.24),0_0_28px_rgba(212,175,55,0.16)] sm:h-14 sm:w-14"
              >
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,217,122,0.16),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Icon className="relative z-10 text-[1rem] sm:text-[1.1rem]" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SocialIcons;