import GuestLayout from '@/Layouts/GuestLayout';
import {useForm} from '@inertiajs/react';
import {Alert, Button, CircularProgress, Grid, TextField, Typography} from "@mui/material";

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
            {status && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{status}</Alert>}
            <form onSubmit={submit} style={{ width: '100%' }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Enter your mobile number to receive a verification code
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="mobile"
                            fullWidth
                            label="Mobile Number"
                            placeholder="Enter your mobile number"
                            value={data.mobile}
                            autoComplete="tel"
                            autoFocus
                            inputMode="tel"
                            onChange={handleChange}
                            helperText={errors.mobile || "Enter your mobile number (e.g., 91234567)"}
                            error={!!errors?.mobile}
                            required
                            sx={{
                                '& .MuiInputBase-root': {
                                    fontSize: '1.1rem',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={processing}
                            fullWidth
                            size="large"
                            startIcon={processing ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {processing ? 'Sending Code...' : 'Send Verification Code'}
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
