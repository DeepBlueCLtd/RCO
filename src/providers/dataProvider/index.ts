import localStorageProvider from 'ra-data-local-storage';
import users from './users';

export const dataProvider = localStorageProvider({
    loggingEnabled: true,
    localStorageKey: 'rco',
    defaultData: {
        users
    }
})