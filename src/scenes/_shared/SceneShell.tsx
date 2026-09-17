import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { SceneMeta } from '@/engine';
import './shell.css';

interface SceneShellProps {
  scene: SceneMeta;
  children?: ReactNode;
  /** Hide the default heading block (hero renders its own). */
  bare?: boolean;
  align?: 'start' | 'center';
  className?: string;
  /**
   * An illustration for this scene. It is set in the margin column under the head, as a
   * figure, so the body keeps the full wide column.
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
      <h2 className="scene-shell__title">{scene.title}</h2>
      {scene.subtitle && <p className="scene-shell__subtitle">{scene.subtitle}</p>}
    </header>
  );

  /**
   * The manual's page grid: heads HANG in a margin column on the start side, the body runs
   * in the wide column beside them. An illustration sits in the margin under its head, as a
   * figure would, rather than competing with the body for the page.
   */
  if (!bare && align === 'start') {
    return (
      <div className={`scene-shell scene-shell--page${className ? ` ${className}` : ''}`}>
        <div className="scene-shell__margin">
          {head}
          {media && <div className="scene-shell__art">{media}</div>}
        </div>
        <div className="scene-shell__body">{children}</div>
      </div>
    );
  }

  return (
    <div className={`scene-shell align-${align}${className ? ` ${className}` : ''}`}>
      {head}
      {media && <div className="scene-shell__art">{media}</div>}
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
