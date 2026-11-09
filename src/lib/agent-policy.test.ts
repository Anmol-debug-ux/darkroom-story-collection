import { describe, expect, it } from 'vitest';
import { agentCount, resolveAgents } from './agent-policy';
describe('Portfolio agent controls', () => {
  it('forces agents on even with reduced motion', () => expect(resolveAgents('?agents=on', 'off', true)).toBe(true));
  it('forces agents off', () => expect(resolveAgents('?agents=off', 'on', false)).toBe(false));
  it('respects a saved preference', () => expect(resolveAgents('', 'off', false)).toBe(false));
  it('defaults to no animation for reduced motion', () => expect(resolveAgents('', null, true)).toBe(false));
  it('uses six cursors on phones', () => expect(agentCount(390)).toBe(6));
  it('uses ten cursors on desktop', () => expect(agentCount(1280)).toBe(10));
});