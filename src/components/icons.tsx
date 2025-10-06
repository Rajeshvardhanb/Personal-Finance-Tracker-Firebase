
import type { SVGProps } from "react";

export function AppLogoIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M10.24 19.52c-1.29.28-2.5.0-3.52-.82-2.2-1.74-2.64-4.88-.9-7.08 1.74-2.2 4.88-2.64 7.08-.9 1.29.98 1.94 2.59 1.62 4.14" />
    </svg>
  );
}

export function AppLogo(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className="flex items-center gap-2">
      <AppLogoIcon className="h-8 w-8 text-white" />
      <span className="whitespace-nowrap text-primary-foreground font-bold text-lg tracking-wide">
        PERSONAL FINANCE
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
