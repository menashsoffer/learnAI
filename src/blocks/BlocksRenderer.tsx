import type { CSSProperties } from 'react';
import type { Block, CalloutTone } from './types';
import './blocks.css';

/**
 * Renders a declarative Block[] — the only sanctioned way to show rich per-scene content.
 * (Kinds are inlined here for now; split into ./kinds/* if this grows.)
 */
export function BlocksRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="blocks">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'heading': {
      const H = (`h${block.level ?? 3}`) as 'h2' | 'h3' | 'h4';
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
          {block.label && <figcaption className="blk-prompt__label">{block.label}</figcaption>}
          <p className="blk-prompt__body" dir="rtl">
            {block.prompt}
          </p>
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="blk-quote">
          <p>{block.text}</p>
          {block.attribution && <cite>— {block.attribution}</cite>}
        </blockquote>
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

    case 'kbd':
      return (
        <div className="blk-kbd">
          <span className="blk-kbd__keys">
            {block.keys.map((k, i) => (
              <kbd key={i}>{k}</kbd>
            ))}
          </span>
          <span className="blk-kbd__desc">{block.description}</span>
        </div>
      );

    case 'image':
      // Assets are resolved by the app (inlined data URIs in the offline build); until the
      // asset pipeline lands (M2/M7) this renders the alt text.
      return (
        <figure className="blk-image">
          <div className="blk-image__placeholder" role="img" aria-label={block.alt}>
            {block.alt}
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case 'spacer':
      return <div className={`blk-spacer blk-spacer--${block.size ?? 'md'}`} aria-hidden="true" />;

    default: {
      const _never: never = block;
      return _never ?? null;
    }
  }
}

export type { CalloutTone };
