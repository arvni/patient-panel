import GuestLayout from '@/Layouts/GuestLayout';
import {Head, useForm} from '@inertiajs/react';
import {Alert, Button, Grid, TextField} from "@mui/material";

const Login = ({status}) => {
    const {data, setData, post, processing, errors} = useForm({
        mobile: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };
    const handleChange = (e) => setData('mobile', e.target.value);

    return (<>
            {status && <Alert severity={"error"}>{status}</Alert>}
            <form onSubmit={submit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField name="mobile"
                                   label="Mobile"
                                   value={data.mobile}
                                   autoComplete="mobile"
                                   focused
                                   inputMode="tel"
                                   onChange={handleChange}
                                   helperText={errors.mobile}
                                   error={!!errors?.mobile}
                                   required/>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" type="submit" disabled={processing}>
                            Log in
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </>
    );
}

Login.layout = page => {
    return <GuestLayout children={page} head="Login"/>
}

export default Login;
