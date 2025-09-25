
import { SVGProps } from 'react';
import { LucideProps, Home, Camera, UserCircle } from 'lucide-react';

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
    <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4" />
    <path d="M4 10h16" />
    <path d="M10 4v2" />
    <path d="M14 4v2" />
    <path d="M9 16h6" />
    <path d="M9 13h6" />
  </svg>
);

export const Icons = {
    home: (props: LucideProps) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="8" height="18" x="3" y="3" rx="1" />
            <rect width="8" height="18" x="13" y="3" rx="1" />
        </svg>
    ),
    camera: Camera,
    profile: UserCircle,
};
