import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 10h1v4" />
      <path d="M16 10h-4v4h4" />
      <path d="M12 10v4" />
      <path d="M16 8.5a2.5 2.5 0 1 0-5 0" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
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
