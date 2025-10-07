
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

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

export function LoginLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
        </svg>
        <span className="text-xl font-bold tracking-wider text-gray-800">
            INFINITY CLOUD LABS
        </span>
    </div>
  );
}

export function Waveform() {
    return (
        <svg width="300" height="60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60a5fa"/>
                    <stop offset="1" stopColor="#5eead4"/>
                </linearGradient>
            </defs>
            <path d="M0 30 Q 37.5 10, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.5"/>
            <path d="M0 30 Q 37.5 40, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.5"/>
            <path d="M0 30 Q 37.5 20, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.2"/>
             <path d="M0 30 Q 37.5 50, 75 30 T 150 30 T 225 30 T 300 30" stroke="url(#waveGradient)" strokeWidth="2" fill="none" strokeOpacity="0.2"/>
        </svg>
    )
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
