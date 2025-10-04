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
      <path d="M5 6v12" />
      <path d="M19 6v12" />
    </svg>
  );
}
