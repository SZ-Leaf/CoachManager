// début d'une nouvelle saison sportive = août 
const SEASON_START_MONTH = 8;

export function seasonApiValueToStartYear(raw) {
  if (raw == null || String(raw).trim() === '') {
    return '';
  }
  const m = String(raw).trim().match(/^(\d{4})-(\d{2})-\d{2}/);
  if (!m) {
    return '';
  }
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return '';
  }
  const startYear = month >= SEASON_START_MONTH ? year : year - 1;
  return String(startYear);
}

export function startYearToSeasonApiValue(startYearStr) {
  const y = Number(startYearStr);
  if (!Number.isFinite(y) || y < 1900 || y > 2100) {
    return '';
  }
  const monthPart = String(SEASON_START_MONTH).padStart(2, '0');
  return `${String(y).padStart(4, '0')}-${monthPart}-01`;
}

export function formatSeasonSportsRange(raw) {
  const start = seasonApiValueToStartYear(raw);
  if (!start) {
    return '';
  }
  const y = Number(start);
  return `${y}-${y + 1}`;
}

export function getDefaultSeasonStartYear() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return month >= SEASON_START_MONTH ? year : year - 1;
}

export function buildSeasonYearSelectOptions(teams = []) {
  const anchor = getDefaultSeasonStartYear();
  let minY = anchor;
  let maxY = anchor + 5;
  for (const t of teams) {
    const raw = t?.season;
    if (raw == null || raw === '') {
      continue;
    }
    const sy = Number(seasonApiValueToStartYear(String(raw).trim()));
    if (!Number.isFinite(sy)) {
      continue;
    }
    minY = Math.min(minY, sy);
    maxY = Math.max(maxY, sy);
  }
  const opts = [];
  for (let y = minY; y <= maxY; y++) {
    opts.push({ value: String(y), label: `${y}-${y + 1}` });
  }
  return opts;
}
