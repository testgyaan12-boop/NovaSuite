import type { SVGProps } from "react";

export function BodybuilderIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M18 15a3 3 0 1 0-6 0" />
      <path d="M12 15a3 3 0 1 0-6 0" />
      <path d="m7 21 1-4" />
      <path d="m16 21-1-4" />
      <path d="M12 4v7" />
      <path d="M7.5 7.5 12 12" />
      <path d="m16.5 7.5-4.5 4.5" />
    </svg>
  );
}