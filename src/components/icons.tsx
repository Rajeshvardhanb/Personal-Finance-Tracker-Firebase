import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      width="200"
      height="40"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g transform="translate(0, 4) scale(0.8)">
        {/* Cloud and Infinity Symbol */}
        <path d="M43.6,15.2c-4-4.5-10.5-5-15.1-1.2c-2.4,2-3.8,4.9-3.8,8c0,3.1,1.4,5.9,3.8,8c4.6,3.8,11.1,3.3,15.1-1.2 C50,23.1,50,19.9,43.6,15.2z M39,23.5c-2.4,2.4-6.3,2.4-8.7,0s-2.4-6.3,0-8.7s6.3-2.4,8.7,0S41.4,21.1,39,23.5z" fill="url(#logoGradient)"/>
        <path d="M24.7,35c-4.6-3.8-11.1-3.3-15.1,1.2C3.2,41.9,3.2,48.4,9.6,53c6.4,4.5,15.1,1.2,15.1-1.2C31,45.9,31,39.5,24.7,35z" fill="url(#logoGradient)" transform="translate(-5, -20)"/>

        {/* Lines */}
        <path d="M10,13H0c-1.1,0-2-0.9-2-2s0.9-2,2-2h10c1.1,0,2,0.9,2,2S11.1,13,10,13z" fill="url(#logoGradient)" />
        <circle cx="2" cy="11" r="2" fill="url(#logoGradient)"/>
        
        <path d="M15,19H0c-1.1,0-2-0.9-2-2s0.9-2,2-2h15c1.1,0,2,0.9,2,2S16.1,19,15,19z" fill="url(#logoGradient)" transform="translate(0, -5)"/>
        <circle cx="2" cy="14" r="2" fill="url(#logoGradient)"/>

        <path d="M10,25H0c-1.1,0-2-0.9-2-2s0.9-2,2-2h10c1.1,0,2,0.9,2,2S11.1,25,10,25z" fill="url(#logoGradient)" transform="translate(0, -10)"/>
        <circle cx="2" cy="17" r="2" fill="url(#logoGradient)"/>

        {/* Pixels */}
        <rect x="45" y="16" width="2.5" height="2.5" fill="hsl(var(--accent))" opacity="0.9" />
        <rect x="49" y="15" width="2" height="2" fill="hsl(var(--accent))" opacity="0.8" />
        <rect x="46" y="20" width="3" height="3" fill="hsl(var(--accent))" />
        <rect x="50" y="19" width="2.5" height="2.5" fill="hsl(var(--accent))" opacity="0.9"/>
        <rect x="53" y="16" width="2" height="2" fill="hsl(var(--accent))" opacity="0.7"/>
        <rect x="50" y="23" width="2" height="2" fill="hsl(var(--accent))" />
        <rect x="54" y="22" width="2.5" height="2.5" fill="hsl(var(--accent))" opacity="0.8"/>
        <rect x="57" y="19" width="2" height="2" fill="hsl(var(--accent))" opacity="0.6"/>
        <rect x="53" y="26" width="2" height="2" fill="hsl(var(--accent))" opacity="0.7"/>
      </g>
      
      {/* Text */}
      <text
        x="60"
        y="24"
        fontFamily="var(--font-headline), sans-serif"
        fontSize="12"
        fill="hsl(var(--foreground))"
        fontWeight="700"
        letterSpacing="0.5"
      >
        INFINITY CLOUD LABS
      </text>
    </svg>
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
