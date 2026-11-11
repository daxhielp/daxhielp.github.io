import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { LINKS } from '../data/content';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = () => {
    navigator.clipboard?.writeText(LINKS.email).then(
      () => setCopied(true),
      () => {},
    );
  };

  return (
    <>
      <h2>contact</h2>
      <dl className="contact-list">
        <dt>email</dt>
        <dd className="contact-email">
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
          <button type="button" onClick={copy} aria-label="Copy email address">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'copied' : 'copy'}</span>
          </button>
        </dd>
        <dt>github</dt>
        <dd>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
            daxhielp ↗
          </a>
        </dd>
        <dt>linkedin</dt>
        <dd>
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            daxhielp ↗
          </a>
        </dd>
      </dl>
    </>
  );
}
