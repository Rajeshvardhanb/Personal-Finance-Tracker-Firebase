import type { SVGProps } from "react";

export function AppLogo(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 40"
        width="24"
        height="24"
        className="h-6 w-6"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          fill="url(#grad1)"
          d="M63.6,12.3c-7.2-7.2-18.8-7.2-26,0L28,22c-2.3,2.3-2.3,6.1,0,8.5c2.3,2.3,6.1,2.3,8.5,0l4.7-4.7 c2.3-2.3,6.1-2.3,8.5,0s2.3,6.1,0,8.5l-8.6,8.6c-7.2,7.2-18.8,7.2-26,0s-7.2-18.8,0-26L25,17.1c2.3-2.3,6.1-2.3,8.5,0 c2.3,2.3,2.3,6.1,0,8.5l-4.7,4.7c-2.3,2.3-6.1,2.3-8.5,0c-2.3-2.3-2.3-6.1,0-8.5l8.6-8.6c7.2-7.2,18.8-7.2,26,0s7.2,18.8,0,26 L45.6,39.1c-2.3,2.3-6.1,2.3-8.5,0s-2.3-6.1,0-8.5l4.7-4.7c2.3-2.3,2.3-6.1,0-8.5s-6.1-2.3-8.5,0l-8.6,8.6 C20.8,40.8,11,40.8,3.8,33.6s-7.2-18.8,0-26L13.4,7.9c2.3-2.3,6.1-2.3,8.5,0s2.3,6.1,0,8.5L17.2,21c-2.3,2.3-2.3,6.1,0,8.5 s6.1,2.3,8.5,0l8.6-8.6c7.2-7.2,18.8-7.2,26,0S70.8,40.8,63.6,48s-18.8,7.2-26,0l-4.7-4.7c-2.3-2.3-2.3-6.1,0-8.5s6.1-2.3,8.5,0 l4.7,4.7c2.3,2.3,6.1,2.3,8.5,0C68.3,26.2,68.3,17,63.6,12.3z"
        />
      </svg>
      <span {...props} className="text-primary-foreground font-bold text-lg tracking-wide">INFINITY CLOUD LABS</span>
    </span>
  );
}

export function RupeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m18 8-6 12" />
      <path d="m6 8 6 12" />
    </svg>
  );
}
