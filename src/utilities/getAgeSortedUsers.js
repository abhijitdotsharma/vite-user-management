export function getAgeSortedUsers(users, sortBy = ''){
    if(sortBy === 'AGE'){
        return [...users].sort((userA, userB) => userA.age - userB.age);
    }
    return users;
}