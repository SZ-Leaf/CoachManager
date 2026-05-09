/** Valeurs API (inchangées en base) → libellés français pour l’affichage. */
export const PLAYER_STATUSES = [
  { value: 'active', label: 'Actif' },
  { value: 'injured', label: 'Blessé' },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'inactive', label: 'Inactif' },
];

const labelByValue = Object.fromEntries(
  PLAYER_STATUSES.map(({ value, label }) => [value, label]),
);

export function formatPlayerStatus(value) {
  if (value == null || value === '') {
    return '';
  }
  return labelByValue[String(value)] ?? String(value);
}
