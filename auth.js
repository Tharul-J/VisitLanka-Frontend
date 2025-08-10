// This data is available from data.js.
// const users = [...];
let currentUser = null; // Holds the currently logged-in user object

const login = (email) => {
    const user = users.find(u => u.email === email);
    if (user) {
        currentUser = { ...user };
        return { success: true, user: currentUser };
    } else {
        return { success: false, message: 'User not found.' };
    }
};

const logout = () => {
    currentUser = null;
};

const getCurrentUser = () => {
    return currentUser;
};
