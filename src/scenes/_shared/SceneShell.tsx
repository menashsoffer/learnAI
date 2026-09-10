import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { SceneMeta } from '@/engine';
import './shell.css';

export function LineMotif() {
  return <span className="line-motif" aria-hidden="true" />;
}

interface SceneShellProps {
  scene: SceneMeta;
  children?: ReactNode;
  /** Hide the default heading block (hero renders its own). */
  bare?: boolean;
  align?: 'start' | 'center';
  className?: string;
  /**
   * An illustration for this scene. Passing it switches the shell to a two-column
   * composition — art on one side, heading AND body together on the other — instead of
   * a full-width heading with a narrow strip underneath. A scene that says one thing
   * needs the canvas split, not stacked.
   */
  media?: ReactNode;
}

export function SceneShell({
  scene,
  children,
  bare,
  align = 'start',
  className,
  media,
}: SceneShellProps) {
  const head = bare ? null : (
    <header className="scene-shell__head">
      <LineMotif />
      <h2 className="scene-shell__title">{scene.title}</h2>
      {scene.subtitle && <p className="scene-shell__subtitle">{scene.subtitle}</p>}
    </header>
  );

  if (media) {
    return (
      <div className={`scene-shell scene-shell--split${className ? ` ${className}` : ''}`}>
        {/* Text first in DOM AND in grid order: the reader must meet the headline before
            the artwork. In RTL that puts text right, art left; LTR mirrors it for free. */}
        <div className="scene-shell__main">
          {head}
          <div className="scene-shell__body">{children}</div>
        </div>
        <div className="scene-shell__art">{media}</div>
      </div>
    );
  }

  return (
    <div className={`scene-shell align-${align}${className ? ` ${className}` : ''}`}>
      {head}
      <div className="scene-shell__body">{children}</div>
    </div>
  );
}

interface BoundaryProps {
  scene: SceneMeta;
  onError?: (event: string, data?: Record<string, unknown>) => void;
  children: ReactNode;
}
interface BoundaryState {
  failed: boolean;
  message?: string;
}

/** A thrown scene never white-screens the deck — it degrades to the shell. */
export class SceneErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(err: unknown): BoundaryState {
    return { failed: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.('scene_error', {
      slug: this.props.scene.slug,
      type: this.props.scene.type,
      message: error.message,
      stack: info.componentStack ?? undefined,
    });
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <SceneShell scene={this.props.scene}>
        <p className="scene-fallback-note">אירעה שגיאה בהצגת הסצנה.</p>
        {import.meta.env.DEV && this.state.message && (
          <pre className="scene-fallback-details">{this.state.message}</pre>
        )}
      </SceneShell>
    );
  }
}
