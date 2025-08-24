"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {segments.map((seg, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          const isLast = idx === segments.length - 1;

          return (
            <li key={href} aria-current={isLast ? "page" : undefined}>
              {isLast ? (
                <span>{seg}</span>
              ) : (
                <Link href={href}>{seg}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

