export const PLAYER_POSITIONS = [
  { value: 'goalkeeper', label: 'Gardien' },
  { value: 'defender', label: 'Défenseur' },
  { value: 'midfielder', label: 'Milieu' },
  { value: 'forward', label: 'Attaquant' },
  { value: 'other', label: 'Autre' },
];

const labelByValue = Object.fromEntries(
  PLAYER_POSITIONS.map(({ value, label }) => [value, label]),
);

export function formatPlayerPosition(value) {
  if (value == null || value === '') {
    return '';
  }
  return labelByValue[String(value)] ?? String(value);
}
