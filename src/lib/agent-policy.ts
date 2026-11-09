export function resolveAgents(query: string, preference: string | null, reducedMotion: boolean) {
  const override = new URLSearchParams(query).get('agents');
  if (override === 'on') return true;
  if (override === 'off') return false;
  if (preference !== null) return preference === 'on';
  return !reducedMotion;
}
export function agentCount(width: number) { return width < 768 ? 6 : 10; }