
import type { SVGProps } from "react";

export function AppLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="white"
      stroke="none"
      {...props}
    >
        <path d="M63.5,31.3c0,0-1.4,0-2.3,0c-0.9,0-2.3-0.1-3.1-0.2c-2.4-0.3-4.6-1.3-6.4-2.8c-1.8-1.5-3.1-3.5-3.8-5.7 c-0.7-2.2-0.7-4.6-0.1-6.9c0.6-2.3,1.8-4.3,3.5-6c1.7-1.7,3.9-2.9,6.3-3.5c2.4-0.6,4.9-0.6,7.2,0.1c2.3,0.7,4.4,1.9,6.1,3.6 c1.7,1.7,2.9,3.8,3.5,6.1c0.6,2.3,0.6,4.8-0.1,7.1c-0.7,2.3-1.9,4.4-3.6,6.1c-1.7,1.7-3.8,2.8-6.1,3.4 C65.5,31.2,64.5,31.3,63.5,31.3z M61.2,10.9c-2,0.5-3.8,1.5-5.2,2.9c-1.4,1.4-2.3,3.2-2.7,5.2c-0.4,2-0.3,4.1,0.3,6 c0.6,1.9,1.7,3.6,3.2,4.9c1.5,1.3,3.3,2.1,5.3,2.4c2,0.3,4,0.1,5.8-0.5c1.8-0.6,3.4-1.6,4.7-3c1.3-1.4,2.2-3.1,2.5-5 c0.3-1.9,0.2-3.9-0.4-5.7c-0.6-1.8-1.6-3.4-2.9-4.7c-1.3-1.3-2.9-2.2-4.7-2.7C64.4,10.7,62.5,10.5,61.2,10.9z" />
        <path d="M42.3,73.1c-4.5-0.1-8.5-2-11.5-5.2c-3-3.2-4.7-7.6-4.7-12.3c0-4.7,1.7-9,4.7-12.3c3-3.2,7-5.1,11.5-5.2 c2.2-0.1,4.4,0.3,6.4,1.2c-0.9,1.3-1.6,2.7-2.1,4.2c-1.2-0.5-2.6-0.8-3.9-0.8c-2.8,0-5.4,1.1-7.3,3.1c-1.9,2-3,4.7-3,7.6 s1.1,5.6,3,7.6c1.9,2,4.5,3.1,7.3,3.1c1.6,0,3.2-0.4,4.6-1.1c0.5,1.5,1.1,2.9,1.9,4.2C46.9,72.6,44.6,73.1,42.3,73.1z" />
        <path d="M91,89.5H9c-2.2,0-4-1.8-4-4s1.8-4,4-4h82c2.2,0,4,1.8,4,4S93.2,89.5,91,89.5z" />
    </svg>
  );
}

export function AppLogo(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className="flex items-center gap-2">
      <AppLogoIcon className="h-8 w-8 text-white" />
      <span className="whitespace-nowrap text-primary-foreground font-bold text-lg tracking-wide">
        INFINITY CLOUD LABS
      </span>
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
