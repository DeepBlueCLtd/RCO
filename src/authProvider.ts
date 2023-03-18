import { AuthProvider } from 'react-admin';

const apiUrl = "http://localhost:5173";

const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
        const data = await fetch(`${apiUrl}/users.json`)
            .then((response: Response) => response.json())
        if (data) {
            const user = data.find((item: any) => item.name === username)
            if (user) {
                if (user.password === password) {
                    localStorage.setItem('userInfo', JSON.stringify(user));
                    return
                } else {
                    throw new Error('Wrong password')
                }
            } else {
                throw new Error('Wrong username')
            }
        } 
    },
    logout: () => {
        localStorage.removeItem('userInfo');
        return Promise.resolve()
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => localStorage.getItem('userInfo') ? Promise.resolve() : Promise.reject(),

    getPermissions: async () => {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            const info = JSON.parse(userInfo)
            if (info.adminRights) {
                return Promise.resolve(true)
            } else {
                return Promise.resolve(false)
            }
        } else {
            return Promise.resolve(false)
        }
    },
    getIdentity: () => {
      const userInfo = localStorage.getItem('userInfo')

      const info = JSON.parse(userInfo??'')
          return Promise.resolve({
          id: info.id,
          fullName: info.name,
          avatar: 'public/img/avatar.png',
      })
  }
};

export default authProvider;
