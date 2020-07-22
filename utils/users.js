const users =[];

function joinuser(id, username, room) {
    const user = {id, username ,room };
    users.push(user);
    return user;
}

function curantuser(id) {
    return users.find(user => user.id === id);
    
}


function userleave(id) {
    const index = users.findIndex(user => user.id=== id);

    if (index !== -1) {
        return users.splice(index ,1)[0];
    }
}

function roomusers(room) {
    return users.filter(user => user.room === room);
}
module.exports={
    joinuser,
    curantuser,
    userleave,
    roomusers
};