import type { Client } from "@/lib/site";

export function ClientLogo({ client }: { client: Client }) {
  return (
    <span className="client-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={client.logo} alt={client.label ? "" : client.name} height={client.height ?? 26} style={{ height: client.height ?? 26 }} loading="lazy" decoding="async" />
      {client.label && <span>{client.name}</span>}
    </span>
  );
}
