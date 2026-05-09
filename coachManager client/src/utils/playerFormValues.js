export function birthdayInputValue(iso) {
  if (!iso) return '';
  return String(iso).slice(0, 10);
}

/**
 * @param {object|null|undefined} player
 */
export function playerToFormInitialValues(player) {
  if (!player) {
    return {};
  }
  return {
    firstname: player.firstname || '',
    lastname: player.lastname || '',
    email: player.email || '',
    phoneNumber: player.phoneNumber || '',
    birthday: birthdayInputValue(player.birthday),
    avatar: player.avatar || '',
    position: player.position || '',
    status: player.status || '',
    rating: player.rating ?? '',
    emergencyName: player.emergencyName || '',
    emergencyEmail: player.emergencyEmail || '',
    emergencyPhoneNumber: player.emergencyPhoneNumber || '',
    teamId: player.teamId ? String(player.teamId) : '',
  };
}
