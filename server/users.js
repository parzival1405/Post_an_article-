const users = [];

export const addUser = ({ idUser, name, id }) => {
    try {
        name = name.trim().toLowerCase();
        id = id.trim().toLowerCase();
    } catch (error) {
        return ({ error: 'No user login' });
    }

    const existingUser = users.find((user) => user.id === id && user.name === name);

    if (existingUser) {
        return ({ error: 'Username is taken' });
    }

    const user = { idUser, name, id };

    users.push(user);

    return { user };
}

export const removeUser = (idUser) => {
    const index = users.findIndex((user) => user.idUser === idUser);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

export const getUser = (idUser) => users.find((user) => user.idUser === idUser);

export const getUsersInRoom = (id) => users.filter((user) => user.id === id)
