import { GROUP_KEYS } from '@/data/groups';
import type { CalculatorState } from '@/lib/state';

export const STORAGE_KEY = 'cgs-ib-trial-v1';

function isState(value: unknown): value is CalculatorState {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const groups = v.groups as Record<string, unknown> | undefined;
  if (typeof groups !== 'object' || groups === null) return false;
  if (!GROUP_KEYS.every((k) => typeof groups[k] === 'object' && groups[k] !== null)) return false;
  const tok = v.tok as Record<string, unknown> | undefined;
  return typeof tok === 'object' && tok !== null && typeof tok.essay === 'number' && typeof tok.exhibition === 'number' && typeof v.ee === 'number';
}

export function loadState(): CalculatorState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveState(state: CalculatorState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, quota) — silently ignore
  }
}
