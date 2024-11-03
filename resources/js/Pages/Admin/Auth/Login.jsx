import {Head,} from '@inertiajs/react';
import {Alert} from "@mui/material";

import GuestLayout from "@/Layouts/GuestLayout";
import LoginForm from "../Components/LoginForm";


const Login = ({status,captchaSiteKey}) => {
    return (
        <GuestLayout>
            <Head title="Login"/>
            {status && <Alert severity={"success"}>{status}</Alert>}
            <LoginForm captchaSiteKey={captchaSiteKey} />
        </GuestLayout>
    );
}
export default Login;
