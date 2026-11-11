import Fingerprint from '../components/Fingerprint';
import resume from '../assets/daxhielperugorria_resume.pdf';

// Detail view shared by roles and projects, so both read the same way.
export default function WorkItem({ item, theme, onBack }) {
  return (
    <>
      <button type="button" className="back" onClick={onBack}>
        ← all work
      </button>
      <h2>{item.title}</h2>
      <div className="meta">
        {item.type} · {item.period ?? item.year}
      </div>
      <Fingerprint seed={item.slug} title={item.title} theme={theme} />
      <p>{item.description}</p>
      <ul className="tech">
        {item.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="links">
        {item.github && (
          <a href={item.github} target="_blank" rel="noopener noreferrer">
            github ↗
          </a>
        )}
        {item.link && (
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            live demo ↗
          </a>
        )}
        {item.kind === 'role' && (
          <a href={resume} target="_blank" rel="noopener noreferrer">
            résumé (PDF) ↗
          </a>
        )}
      </div>
    </>
  );
}
