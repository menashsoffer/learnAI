import { createContext, useContext, useState, type CSSProperties } from 'react';
import type { Block, CalloutTone } from './types';
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

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`blk-copy${done ? ' is-done' : ''}`}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          },
          () => {},
        );
      }}
    >
      {done ? '✓ הועתק' : '⧉ העתק'}
    </button>
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
      return (
        <figure className={`blk-prompt tone-${block.tone ?? 'accent'}`}>
          <div className="blk-prompt__head">
            {block.label && <figcaption className="blk-prompt__label">{block.label}</figcaption>}
            {copyable && <CopyButton text={block.prompt} />}
          </div>
          <p className="blk-prompt__body" dir="rtl">
            {block.prompt}
          </p>
        </figure>
      );

    case 'columns':
      return (
        <div className="blk-columns" style={{ '--cols': block.columns.length } as CSSProperties}>
          {block.columns.map((col, i) => (
            <div key={i} className={`blk-col${col.tone ? ` tone-${col.tone}` : ''}`}>
              {col.title && <div className="blk-col__title">{col.title}</div>}
              <BlocksRenderer blocks={col.blocks} />
            </div>
          ))}
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
