export function getBloodGroupFilteredUsers(users, bloodGroup) {
  if (bloodGroup === '') return users;
  return users.filter((user) => user.bloodGroup.includes(bloodGroup));
}
