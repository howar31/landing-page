import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
}

export type IconComponent = (props: IconProps) => JSX.Element;

function createIcon(displayName: string, children: React.ReactNode): IconComponent {
  function Icon({ size = 24, className, ...rest }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...rest}
      >
        {children}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

// Inline SVG paths copied verbatim from lucide-react v0.460.0 (ISC license).
// Default attributes mirror lucide's defaultAttributes so output is identical.

export const Github = createIcon(
  "Github",
  <>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </>,
);

export const BookOpen = createIcon(
  "BookOpen",
  <>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </>,
);

export const MapPin = createIcon(
  "MapPin",
  <>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </>,
);

export const Lock = createIcon(
  "Lock",
  <>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
);

export const ChevronDown = createIcon(
  "ChevronDown",
  <path d="m6 9 6 6 6-6" />,
);

export const ChevronUp = createIcon(
  "ChevronUp",
  <path d="m18 15-6-6-6 6" />,
);
