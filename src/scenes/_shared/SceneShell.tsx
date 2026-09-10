import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { SceneMeta } from '@/engine';
import './shell.css';

export function LineMotif() {
  return <span className="line-motif" aria-hidden="true" />;
}

export function SelfReadingBox({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <aside className="self-reading">
      <span className="self-reading__label">📖 קריאה עצמית</span>
      <p>{text}</p>
    </aside>
  );
}

interface SceneShellProps {
  scene: SceneMeta;
  children?: ReactNode;
  /** Hide the default heading block (hero / section-cover render their own). */
  bare?: boolean;
  align?: 'start' | 'center';
  className?: string;
}

export function SceneShell({ scene, children, bare, align = 'start', className }: SceneShellProps) {
  return (
    <div className={`scene-shell align-${align}${className ? ` ${className}` : ''}`}>
      {!bare && (
        <header className="scene-shell__head">
          <LineMotif />
          <h2 className="scene-shell__title">{scene.title}</h2>
          {scene.subtitle && <p className="scene-shell__subtitle">{scene.subtitle}</p>}
        </header>
      )}
      <div className="scene-shell__body">{children}</div>
      <SelfReadingBox text={scene.selfReading} />
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
