import type { SVGProps } from "react";

export function ApexAthleticsLogo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 19.5L9 5l2.5 6L16 5l5 14.5" />
      <path d="M7 13h10" />
    </svg>
  );
}
