import { createContext, useContext, useRef, type CSSProperties } from 'react';
import type { Block, CalloutTone } from './types';
import { PromptBuilder, Checklist, DoNow } from './interactive';
import { useCopy, COPY_LABEL } from './useCopy';
import './blocks.css';

const CopyableCtx = createContext(false);

/**
 * Renders a declarative Block[] — the only sanctioned way to show rich per-scene content.
 * `copyable` (study mode) adds a copy button to example-prompt blocks.
 */
export function BlocksRenderer({
  blocks,
  copyable = false,
}: {
  blocks: Block[];
  copyable?: boolean;
}) {
  return (
    <CopyableCtx.Provider value={copyable}>
      <div className="blocks">
        {blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>
    </CopyableCtx.Provider>
  );
}

/**
 * `selectTargetRef` points at the element holding the same text. When every copy mechanism
 * is blocked, that text is selected so the reader can copy it by hand — and the button says
 * so, instead of appearing to have worked.
 */
function CopyButton({
  text,
  selectTarget,
}: {
  text: string;
  selectTarget?: React.RefObject<HTMLElement | null>;
}) {
  const { state, copy } = useCopy();
  return (
    <button
      type="button"
      className={`blk-copy is-${state}`}
      onClick={() => copy(text, selectTarget?.current)}
      aria-live="polite"
    >
      {COPY_LABEL[state]}
    </button>
  );
}

function ExamplePrompt({
  block,
  copyable,
}: {
  block: Extract<Block, { kind: 'example-prompt' }>;
  copyable: boolean;
}) {
  const body = useRef<HTMLParagraphElement>(null);
  return (
    <figure className={`blk-prompt tone-${block.tone ?? 'accent'}`}>
      <div className="blk-prompt__head">
        {block.label && <figcaption className="blk-prompt__label">{block.label}</figcaption>}
        {copyable && <CopyButton text={block.prompt} selectTarget={body} />}
      </div>
      <p className="blk-prompt__body" ref={body} dir="rtl">
        {block.prompt}
      </p>
    </figure>
  );
}

function BlockView({ block }: { block: Block }) {
  const copyable = useContext(CopyableCtx);
  switch (block.kind) {
    case 'heading': {
      const H = `h${block.level ?? 3}` as 'h2' | 'h3' | 'h4';
      return <H className="blk-heading">{block.text}</H>;
    }

    case 'paragraph':
      return <p className={block.emphasis ? 'blk-p blk-p--em' : 'blk-p'}>{block.text}</p>;

    case 'list':
      return block.ordered ? (
        <ol className="blk-list">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="blk-list">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );

    case 'callout':
      return (
        <div className={`blk-callout tone-${block.tone}`}>
          {block.title && <div className="blk-callout__title">{block.title}</div>}
          {block.text && <p className="blk-callout__text">{block.text}</p>}
          {block.items && (
            <ul className="blk-list">
              {block.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'example-prompt':
      return <ExamplePrompt block={block} copyable={copyable} />;

    case 'columns':
      return (
        <div className="blk-columns" style={{ '--cols': block.columns.length } as CSSProperties}>
          {block.columns.map((col, i) => (
            <div key={i} className={`blk-col${col.tone ? ` tone-${col.tone}` : ''}`}>
              {col.title && <div className="blk-col__title">{col.title}</div>}
              <BlocksRenderer blocks={col.blocks} copyable={copyable} />
            </div>
          ))}
        </div>
      );

    case 'do-now':
      return <DoNow block={block} />;

    case 'prompt-builder':
      return <PromptBuilder block={block} />;

    case 'checklist':
      return <Checklist block={block} />;

    /**
     * Fixed four-field shape on purpose. Skills / MCP / Plugins / Agents only become
     * distinguishable when they are described on IDENTICAL axes — the moment each gets its
     * own bespoke explanation, they blur back together.
     */
    case 'concept-card':
      return (
        <div className="blk-concept">
          <div className="blk-concept__head">
            <h4 className="blk-concept__term">{block.term}</h4>
            {block.latin && (
              <span className="blk-concept__latin" dir="ltr">
                {block.latin}
              </span>
            )}
          </div>
          <dl className="blk-concept__grid">
            <div>
              <dt>מה זה</dt>
              <dd>{block.what}</dd>
            </div>
            <div>
              <dt>מתי משתמשים</dt>
              <dd>{block.when}</dd>
            </div>
            <div>
              <dt>דוגמה מהשלטון המקומי</dt>
              <dd>{block.example}</dd>
            </div>
            <div className="blk-concept__not">
              <dt>ולא להתבלבל עם</dt>
              <dd>{block.notToBeConfusedWith}</dd>
            </div>
          </dl>
        </div>
      );

    case 'steps':
      return (
        <ol className="blk-steps">
          {block.steps.map((st, i) => (
            <li key={i} className="blk-step">
              <span className="blk-step__n" aria-hidden="true">
                {i + 1}
              </span>
              <div className="blk-step__body">
                <span>{st.text}</span>
                {st.copy && copyable && <CopyButton text={st.copy} />}
              </div>
            </li>
          ))}
        </ol>
      );

    case 'table':
      /* Wide tables scroll inside their own box — the page body never scrolls sideways. */
      return (
        <div className="blk-table-wrap">
          <table className="blk-table">
            {block.caption && <caption>{block.caption}</caption>}
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={c}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'details':
      return (
        <details className="blk-details">
          <summary className="blk-details__summary">{block.summary}</summary>
          <div className="blk-details__body">
            <BlocksRenderer blocks={block.blocks} copyable={copyable} />
          </div>
        </details>
      );

    /* Improvement has to be SEEN. Asserting that a prompt got better teaches nothing. */
    case 'compare-pair':
      return (
        <div className="blk-compare">
          <div className="blk-compare__side blk-compare__side--before">
            <div className="blk-compare__label">{block.beforeLabel ?? 'לפני'}</div>
            <p className="blk-compare__text" dir="rtl">
              {block.before}
            </p>
          </div>
          <div className="blk-compare__side blk-compare__side--after">
            <div className="blk-compare__label">
              {block.afterLabel ?? 'אחרי'}
              {copyable && <CopyButton text={block.after} />}
            </div>
            <p className="blk-compare__text" dir="rtl">
              {block.after}
            </p>
          </div>
          {block.notes && block.notes.length > 0 && (
            <ul className="blk-compare__notes">
              {block.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'cta':
      return (
        <div className="blk-cta">
          <a
            className="btn-action"
            href={block.href}
            {...(block.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {block.label}
          </a>
          {block.note && <div className="blk-cta__note">{block.note}</div>}
        </div>
      );

    default: {
      const _never: never = block;
      return _never ?? null;
    }
  }
}

export type { CalloutTone };
