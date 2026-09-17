// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Activity from './index';
import type { SceneMeta } from '@/engine';
import type { ActivityData } from './schema';
import type { SceneApi } from '../contract';

describe('Activity component rendering & timer behavior', () => {
  const mockScene: SceneMeta = {
    id: 'test-activity',
    slug: 'test-activity',
    type: 'activity',
    stage: 'תרגול #1',
    title: 'בדיקת פעילות',
    subtitle: 'תת-כותרת',
  };

  const sampleData: ActivityData = {
    doNow: 'בצעו את המשימה עכשיו',
    timeboxSeconds: 420,
    steps: ['שלב 1', 'שלב 2'],
    prompt: { mode: 'copy', label: 'פרומפט', text: 'טקסט של הפרומפט לבדיקה...' },
  };

  const makeMockApi = (target = 0): { api: SceneApi; setTarget: ReturnType<typeof vi.fn> } => {
    const setTarget = vi.fn();
    return {
      setTarget,
      api: {
        online: true,
        timer: {
          model: { status: 'idle', seconds: target, target },
          setTarget,
          toggle: vi.fn(),
          reset: vi.fn(),
        },
      },
    };
  };

  it('calls setTarget when active and target differs', () => {
    const { api, setTarget } = makeMockApi(0);
    const Component = Activity.Component;

    render(<Component data={sampleData} scene={mockScene} api={api} active={true} />);

    expect(setTarget).toHaveBeenCalledWith(420);
  });

  it('does NOT call setTarget when scene is inactive (e.g. pre-mounted neighbor slide)', () => {
    const { api, setTarget } = makeMockApi(0);
    const Component = Activity.Component;

    render(<Component data={sampleData} scene={mockScene} api={api} active={false} />);

    expect(setTarget).not.toHaveBeenCalled();
  });

  it('arms the timer when a pre-mounted neighbour becomes the active scene', () => {
    const { api, setTarget } = makeMockApi(0);
    const Component = Activity.Component;

    const { rerender } = render(
      <Component data={sampleData} scene={mockScene} api={api} active={false} />,
    );
    expect(setTarget).not.toHaveBeenCalled();

    rerender(<Component data={sampleData} scene={mockScene} api={api} active={true} />);
    expect(setTarget).toHaveBeenCalledWith(420);
  });

  it('does NOT re-arm when the presenter adjusts the target (would wipe a running timer)', () => {
    const { api, setTarget } = makeMockApi(420);
    const Component = Activity.Component;

    const { rerender } = render(
      <Component data={sampleData} scene={mockScene} api={api} active={true} />,
    );
    expect(setTarget).toHaveBeenCalledTimes(1);

    const adjusted: SceneApi = {
      ...api,
      timer: { ...api.timer, model: { status: 'running', seconds: 470, target: 480 } },
    };
    rerender(<Component data={sampleData} scene={mockScene} api={adjusted} active={true} />);
    expect(setTarget).toHaveBeenCalledTimes(1);
  });
});
