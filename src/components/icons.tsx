
import { SVGProps } from 'react';
import { LucideProps, Home, Camera, UserCircle, Settings, Newspaper, Sparkles } from 'lucide-react';

export const AppLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="M8 10h.01" />
    <path d="M16 10h-4" />
    <path d="M8 14h.01" />
    <path d="M16 14h-4" />
  </svg>
);

export const Icons = {
    home: Home,
    camera: Camera,
    settings: Settings,
    aiAssistant: Sparkles,
    profile: UserCircle,
    businessInfo: Newspaper,
};
