export function getNameSortedUsers(users, sortBy){

    if (sortBy === 'FIRST_NAME'){
        return [...users].sort((a, b) => a.firstName.localeCompare(b.firstName));
    }

    if (sortBy === 'LAST_NAME'){
        return [...users].sort((a, b) => a.lastName.localeCompare(b.lastName));
    }
    return users;
}