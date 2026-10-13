import { ClientLogo } from "@/components/ClientLogo";
import { trustedBy } from "@/lib/site";

export function ClientLogos() {
  return (
    <div className="client-logos">
      <div className="client-logos-heading">
        <p>Built for teams hiring talent like</p>
      </div>
      <div className="client-logos-window" role="region" tabIndex={0} aria-label="Client logos. Hover or focus to pause scrolling.">
        <div className="client-logos-track">
          {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1}>{trustedBy.map(client => <li key={client.name}><ClientLogo client={client} /></li>)}</ul>)}
        </div>
      </div>
    </div>
  );
}
