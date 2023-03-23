export const authProvider = {
    // called when the user attempts to log in
    login: (user: any) => {
        localStorage.setItem("user", JSON.stringify(user));
        // accept all username/password combinations
        return Promise.resolve({ redirectTo: '/dashboard' });
    },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("user");
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }: any) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("user");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        const user = localStorage.getItem("user")
        return user
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        let user = localStorage.getItem("user");
        if (user) {
            let role = JSON.parse(user).isAdmin
            return Promise.resolve(role ? "admin" : "user")
        }
        return Promise.resolve()
    },
    // get the user's profile
    getIdentity: () => {
        let user = localStorage.getItem("user");
        return user
            ? Promise.resolve(JSON.parse(user))
            : Promise.reject();
    },

};