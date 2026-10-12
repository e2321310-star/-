// 線画のみのシンプルなアイコン集。絵文字・イラストの代わりに全画面でこれを使う。
// 1色(currentColor)・同じ線の太さで統一し、サイズは呼び出し側のclassNameで指定する。
import type { ReactNode } from "react";

export type IconName =
  | "record"
  | "bottle"
  | "droplet"
  | "jar"
  | "syringe"
  | "bucket"
  | "shield"
  | "sparkle"
  | "clinic"
  | "gear"
  | "camera"
  | "search"
  | "chat"
  | "check"
  | "checkCircle"
  | "warning"
  | "info"
  | "chevronLeft"
  | "chevronRight"
  | "chevronDown"
  | "money"
  | "pin"
  | "mail"
  | "calendar"
  | "clock"
  | "target"
  | "utensils"
  | "link"
  | "edit"
  | "trash"
  | "refresh"
  | "sun"
  | "moon"
  | "eye"
  | "nose"
  | "bandage"
  | "question"
  | "cloud"
  | "grid"
  | "dot"
  | "leaf"
  | "x";

const PATHS: Record<IconName, ReactNode> = {
  record: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 3.5V6h6V3.5" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3.5h4v3l1.5 2v10a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-10l1.5-2v-3Z" />
      <path d="M9 11h6" />
    </>
  ),
  droplet: <path d="M12 3.5c3 4 5.5 7.4 5.5 10.3a5.5 5.5 0 1 1-11 0c0-2.9 2.5-6.3 5.5-10.3Z" />,
  jar: (
    <>
      <rect x="6" y="8.5" width="12" height="11.5" rx="2.5" />
      <path d="M8.5 8.5V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2.5" />
    </>
  ),
  syringe: (
    <>
      <path d="M20 4.5 17.8 6.7" />
      <path d="M16 3.5l4.5 4.5" />
      <path d="M15 7.5l5 5-8 8-5-5Z" />
      <path d="M9 17l-3 3" />
      <path d="M11.5 10.5l3 3" />
    </>
  ),
  bucket: (
    <>
      <path d="M5.5 8h13l-1.6 10.5a2 2 0 0 1-2 1.7H9.1a2 2 0 0 1-2-1.7L5.5 8Z" />
      <path d="M4.5 8h15" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  shield: <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />,
  sparkle: (
    <>
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <path d="M12 8l1.6 2.4L16 12l-2.4 1.6L12 16l-1.6-2.4L8 12l2.4-1.6Z" />
    </>
  ),
  clinic: (
    <>
      <rect x="4" y="9.5" width="16" height="10.5" rx="1.5" />
      <path d="M9 20V15a3 3 0 0 1 6 0v5" />
      <path d="M9.5 9.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 6v3.5" />
      <path d="M11 6.7h2M12 5.7v2" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M6.3 17.7l1.6-1.6M16.1 7.9l1.6-1.6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
  chat: <path d="M4 5.5h16v10H9l-4 3.5v-3.5H4Z" />,
  check: <path d="M4.5 12.5l4.5 4.5 10.5-11" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.3l2.7 2.7 4.7-5.4" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 21 19H3Z" />
      <path d="M12 10.3v3.6" />
      <circle cx="12" cy="16.3" r="0.15" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8.2" r="0.15" fill="currentColor" stroke="none" />
    </>
  ),
  chevronLeft: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  chevronRight: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  chevronDown: <path d="M5.5 9.5 12 16l6.5-6.5" />,
  money: (
    <>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <circle cx="12" cy="12.5" r="2.4" />
      <path d="M6.5 7v11M17.5 7v11" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0C5.5 15 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8 3.5v3.5M16 3.5v3.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12.5" r="8.2" />
      <path d="M12 8v4.8l3.2 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="12" cy="12" r="0.4" fill="currentColor" stroke="none" />
    </>
  ),
  utensils: (
    <>
      <path d="M7 3.5v8a1.5 1.5 0 0 0 3 0v-8M8.5 3.5v6" />
      <path d="M16.5 3.5c-1.5 0-2.5 1.4-2.5 3.2 0 1.5.8 2.6 1.8 3v10.8M16.5 3.5v16.5" />
    </>
  ),
  link: (
    <>
      <path d="M10 14 14 10" />
      <path d="M8.5 15.5 6 18a3 3 0 0 1-4.2-4.2l2.5-2.5a3 3 0 0 1 4.2 0" />
      <path d="M15.5 8.5 18 6a3 3 0 1 0-4.2-4.2l-2.5 2.5a3 3 0 0 0 0 4.2" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20l1-4.2L15.5 5.3a1.8 1.8 0 0 1 2.5 0l0.7.7a1.8 1.8 0 0 1 0 2.5L8.2 19l-4.2 1Z" />
      <path d="M14 7l3 3" />
    </>
  ),
  trash: (
    <>
      <path d="M5 7h14M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7l1 12.3a1.7 1.7 0 0 0 1.7 1.7h5.6a1.7 1.7 0 0 0 1.7-1.7L17.5 7" />
    </>
  ),
  refresh: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M17.5 4.5v3.5H14M6.5 19.5V16H10" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3.5v2M12 18.5v2M4.5 12h2M17.5 12h2M6.6 6.6l1.4 1.4M16 16l1.4 1.4M6.6 17.4 8 16M16 8l1.4-1.4" />
    </>
  ),
  moon: <path d="M19 14.5a8 8 0 1 1-8-11 6.3 6.3 0 0 0 8 11Z" />,
  eye: (
    <>
      <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  nose: <path d="M10.5 4c-.6 2.8-2 6.6-2 9.2a3.5 3.5 0 0 0 3.5 3.3 3.5 3.5 0 0 0 3.5-3.3c0-2.6-1.4-6.4-2-9.2" />,
  bandage: (
    <>
      <rect x="4.5" y="9" width="15" height="6" rx="3" transform="rotate(-15 12 12)" />
      <circle cx="9.3" cy="11" r="0.6" fill="currentColor" stroke="none" transform="rotate(-15 12 12)" />
      <circle cx="14.7" cy="13" r="0.6" fill="currentColor" stroke="none" transform="rotate(-15 12 12)" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.3a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3.9-1.3 2" />
      <circle cx="12" cy="16.3" r="0.15" fill="currentColor" stroke="none" />
    </>
  ),
  cloud: <path d="M7 17a3.5 3.5 0 0 1-.5-7 4.5 4.5 0 0 1 8.6-1.6A3.8 3.8 0 0 1 17 15.8a1 1 0 0 1-.9 1.2H7Z" />,
  grid: (
    <>
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="16" cy="8" r="1.3" />
      <circle cx="8" cy="16" r="1.3" />
      <circle cx="16" cy="16" r="1.3" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3" />,
  leaf: <path d="M19 5c-7 0-14 3-14 10.5a5 5 0 0 0 5 5C17 20.5 19 12 19 5Z" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
