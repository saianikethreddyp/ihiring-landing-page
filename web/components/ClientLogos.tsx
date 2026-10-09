import { BrandLockup } from "@/components/Brands";
import { trustedBy } from "@/lib/site";

export function ClientLogos() {
  return (
    <div className="client-logos">
      <div className="client-logos-heading">
        <p>Trusted by teams at</p>
      </div>
      <div className="client-logos-window" role="region" tabIndex={0} aria-label="Client logos. Hover or focus to pause scrolling.">
        <div className="client-logos-track">
          {[0, 1].map(copy => <ul key={copy} aria-hidden={copy === 1}>{trustedBy.map(name => <li key={name}><BrandLockup name={name} markSize={28} /></li>)}</ul>)}
        </div>
      </div>
    </div>
  );
}
