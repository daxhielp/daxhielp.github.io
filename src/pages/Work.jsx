import { WORK } from '../data/content';
import resume from '../assets/daxhielperugorria_resume.pdf';

export default function Work({ onOpen }) {
  return (
    <>
      <h2>work</h2>
      <ol className="works">
        {WORK.map((item, i) => (
          <li key={item.slug}>
            <a
              className="work-row"
              href={`#/work/${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onOpen(item.slug);
              }}
            >
              <span className="wr-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="wr-t">{item.title}</span>
              <span className="wr-k">{item.type}</span>
              <span className="wr-y">{item.year}</span>
            </a>
          </li>
        ))}
      </ol>
      <a className="dl list-foot" href={resume} target="_blank" rel="noopener noreferrer">
        résumé (PDF) ↗
      </a>
    </>
  );
}
