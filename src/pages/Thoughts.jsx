import { THOUGHTS } from '../data/content';

const fmt = (iso) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    .toLowerCase();

export function ThoughtsList({ onOpen }) {
  return (
    <>
      <h2>thoughts</h2>
      {THOUGHTS.length === 0 ? (
        <p className="empty">no posts yet. notes on what i'm building and learning will show up here.</p>
      ) : (
        <ol className="works">
          {THOUGHTS.map((t) => (
            <li key={t.slug}>
              <a
                className="work-row thought-row"
                href={`#/thoughts/${t.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpen(t.slug);
                }}
              >
                <span className="wr-t">{t.title}</span>
                <span className="wr-y">{fmt(t.date)}</span>
                {t.summary && <span className="thought-sum">{t.summary}</span>}
              </a>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

// Inline syntax inside paragraph strings: [text](url) links and `code` spans.
const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

function renderInline(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const external = /^https?:\/\//.test(m[2]);
      out.push(
        <a key={m.index} href={m[2]} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>
          {m[1]}
        </a>,
      );
    } else {
      out.push(<code key={m.index}>{m[3]}</code>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Block({ block }) {
  if (typeof block === 'string') return <p>{renderInline(block)}</p>;
  if (block.type === 'code') {
    return (
      <figure className="code-block">
        {block.lang && <figcaption>{block.lang}</figcaption>}
        <pre>
          <code>{block.code}</code>
        </pre>
      </figure>
    );
  }
  return null;
}

export function Thought({ post, onBack }) {
  return (
    <article>
      <button type="button" className="back" onClick={onBack}>
        ← all thoughts
      </button>
      <h2>{post.title}</h2>
      <div className="meta">{fmt(post.date)}</div>
      {post.body.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </article>
  );
}
