import { useState } from 'react';
import { useLogin, useNotify, useGetList, useCreate, Button, Show, Labeled, TextField } from 'react-admin';
import { Card, Stack } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const MyLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();
    const [create] = useCreate();

    const { data, total, isLoading } = useGetList('users');
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // will call authProvider.login({ email, password })
        const userData = data?.filter((user: any) => user.name === username && user.password === password)
        if (userData?.length) {
            let [user] = userData;
            let data = { ...user, date: new Date(), activityType: "login", activityDetail: "new login session started" }
            delete data.id;
            create('reports', { data })
            login(user).catch(() =>
                notify('Invalid email or password')
            );
        }
        else {
            notify('Invalid email or password')
        }
    };

    return (
        <div className="loginPage">
            <h2 className="mb-5">Welcome to RCO</h2>
            <form id="form" onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" required name="username" placeholder='username' value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" required name="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <Button type='submit' label='Login' color='primary' size='large' startIcon={<LoginIcon />} ></Button>
                </div>
            </form>
        </div>
    );
};

export default MyLoginPage;