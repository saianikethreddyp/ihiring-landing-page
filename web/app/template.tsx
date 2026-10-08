import type { ReactNode } from "react";

/** Next remounts this wrapper on navigation, replaying the page entrance. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-opening">{children}</div>;
}
