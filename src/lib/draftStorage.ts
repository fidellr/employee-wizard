import type { Role, DraftData } from "../types/Employee";

const DRAFT_KEY_PREFIX = "draft_";

export const draftStorage = {
  save(role: Role, data: DraftData): void {
    const key = `${DRAFT_KEY_PREFIX}${role}`;
    localStorage.setItem(key, JSON.stringify(data));
  },

  load(role: Role): DraftData | null {
    const key = `${DRAFT_KEY_PREFIX}${role}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  clear(role: Role): void {
    const key = `${DRAFT_KEY_PREFIX}${role}`;
    localStorage.removeItem(key);
  },
};
