import { SVGProps } from 'react';

export const CoinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="12"
      fontWeight="bold"
      fill="white"
      stroke="none"
    >
      S
    </text>
  </svg>
);
