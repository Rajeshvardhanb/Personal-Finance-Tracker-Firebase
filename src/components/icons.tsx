import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 40"
      width="128"
      height="40"
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#2E3192" />
        </linearGradient>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
          `}
        </style>
      </defs>

      <g transform="translate(0, 4)">
        {/* Icon */}
        <path
          d="M28.4,5.6c-3.5-3.4-9.2-3.4-12.7,0c-1.7,1.7-2.6,3.9-2.6,6.3c0,2.4,0.9,4.6,2.6,6.3c3.5,3.4,9.2,3.4,12.7,0 c1.7-1.7,2.6-3.9,2.6-6.3C31,9.5,30.1,7.2,28.4,5.6z M24,14.8c-1.3,1.3-3,2-4.8,2s-3.5-0.7-4.8-2c-1.3-1.3-2-3-2-4.8s0.7-3.5,2-4.8 c1.3-1.3,3-2,4.8-2s3.5,0.7,4.8,2c1.3,1.3,2,3,2,4.8S25.3,13.5,24,14.8z"
          fill="url(#logoGradient)"
        />
        <path
          d="M19.2,28.8c1.3-1.3,3-2,4.8-2s3.5,0.7,4.8,2c1.3,1.3,2,3,2,4.8s-0.7,3.5-2,4.8c-1.3,1.3-3,2-4.8,2 s-3.5-0.7-4.8-2c-1.3-1.3-2-3-2-4.8S17.9,30.1,19.2,28.8z"
          fill="url(#logoGradient)"
          transform="translate(-10, -10)"
        />
        <path
          d="M33,18.4c1.1-1.1,2.6-1.7,4.2-1.7h5.1c0.8,0,1.5-0.7,1.5-1.5s-0.7-1.5-1.5-1.5h-5.1c-1.6,0-3.1,0.6-4.2,1.7 c-1.1,1.1-1.7,2.6-1.7,4.2v5.1c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5v-5.1C31.3,21,31.9,19.5,33,18.4z"
          fill="url(#logoGradient)"
        />
        <rect x="35" y="24" width="2" height="2" fill="url(#logoGradient)" />
        <rect x="38" y="21" width="2" height="2" fill="url(#logoGradient)" />
        <rect x="38" y="27" width="2" height="2" fill="url(#logoGradient)" />
        <rect x="41" y="18" width="2" height="2" fill="url(#logoGradient)" />
        <rect x="41" y="24" width="2" height="2" fill="url(#logoGradient)" />
        <rect x="44" y="21" width="2" height="2" fill="url(#logoGradient)" />
        <path
          d="M10,13H2c-1.1,0-2-0.9-2-2s0.9-2,2-2h8c1.1,0,2,0.9,2,2S11.1,13,10,13z"
          fill="url(#logoGradient)"
        />
        <circle cx="5" cy="11" r="2" fill="url(#logoGradient)" />
        <path
          d="M10,19H2c-1.1,0-2-0.9-2-2s0.9-2,2-2h8c1.1,0,2,0.9,2,2S11.1,19,10,19z"
          fill="url(#logoGradient)"
          transform="translate(0, -5)"
        />
        <circle cx="5" cy="14" r="2" fill="url(#logoGradient)" />
        <path
          d="M10,25H2c-1.1,0-2-0.9-2-2s0.9-2,2-2h8c1.1,0,2,0.9,2,2S11.1,25,10,25z"
          fill="url(#logoGradient)"
          transform="translate(0, -10)"
        />
        <circle cx="5" cy="17" r="2" fill="url(#logoGradient)" />
      </g>

      <text
        x="42"
        y="25"
        fontFamily="Orbitron, sans-serif"
        fontSize="12"
        fill="url(#logoGradient)"
        fontWeight="700"
        letterSpacing="0"
      >
        INFINITY CLOUD
      </text>
       <text
        x="75"
        y="38"
        fontFamily="Orbitron, sans-serif"
        fontSize="10"
        fill="url(#logoGradient)"
        fontWeight="700"
        letterSpacing="4"
      >
        LABS
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
