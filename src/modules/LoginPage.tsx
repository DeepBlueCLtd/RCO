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
            <div className="login_box p-4">
            <h1 className="m-0 mb-5">Welcome to RCO</h1>
            <form id="form" onSubmit={handleSubmit}>
                <div className='mb-3 text_boxes'>
                    <label className='mb-1'>Username</label>
                    <input type="text" required name="username" placeholder='username' value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className='mb-3 text_boxes'>
                    <label className='mb-1'>Password</label>
                    <input type="password" required name="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div>
                    <Button className='subnit_btn' type='submit' label='Login' color='primary' size='large' startIcon={<LoginIcon />} ></Button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default MyLoginPage;