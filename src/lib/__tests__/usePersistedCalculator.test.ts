// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { initialState } from '@/lib/state';
import { STORAGE_KEY } from '@/lib/storage';
import { usePersistedCalculator } from '@/lib/usePersistedCalculator';

const seeded = {
  ...initialState,
  groups: { ...initialState.groups, g4: { subjectId: 'physics', level: 'HL', marks: { 'Paper 2': 60 } } },
  ee: 20,
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('usePersistedCalculator', () => {
  it('loads saved state on mount and never overwrites it with the initial state', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    const { result } = renderHook(() => usePersistedCalculator());
    await waitFor(() => expect(result.current[0].groups.g4.subjectId).toBe('physics'));
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');
    expect(stored.groups.g4).toEqual({ subjectId: 'physics', level: 'HL', marks: { 'Paper 2': 60 } });
    expect(stored.ee).toBe(20);
  });

  it('writes nothing until the state changes when there is no saved data', async () => {
    const { result } = renderHook(() => usePersistedCalculator());
    await waitFor(() => expect(result.current[0]).toEqual(initialState));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    act(() => result.current[1]({ type: 'setEE', value: 12 }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')?.ee).toBe(12));
  });

  it('persists a reset', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    const { result } = renderHook(() => usePersistedCalculator());
    await waitFor(() => expect(result.current[0].ee).toBe(20));
    act(() => result.current[1]({ type: 'reset' }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null')?.ee).toBe(0));
  });
});
