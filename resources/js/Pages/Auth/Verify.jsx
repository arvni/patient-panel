import GuestLayout from '@/Layouts/GuestLayout';
import {useForm} from '@inertiajs/react';
import {Button, Stack, TextField, Typography} from "@mui/material";
import CodeField from "@/Components/CodeField";
import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import {useState} from "react";


function Verify({mobile}) {
    const {data, setData, post, processing, errors, setError, clearErrors} = useForm({
        code: '',
        mobile
    });

    const [showResend, setShowResend] = useState(false)

    const submit = (e) => {
        e.preventDefault();
        if (check())
            post(route('verify'));
    };
    const check = () => {
        clearErrors()
        let output = true;
        if (!data.mobile || !/^/.test(data.mobile)) {
            setError("mobile", "Please Enter a valid number")
            output = false
        }
        if (data.code.length !== 6) {
            setError("code", "Please Enter a valid code")
            output = false
        }
        return output
    }
    const handleShowResend = () => {
        setShowResend(true)
    }
    const handleResendCode = () => post(route("login"), {
        onSuccess: () => {

            setShowResend(false);
        }
    });
    return (
        <form onSubmit={submit} style={{ width: '100%' }}>
            <Stack spacing={3}>
                <TextField
                    name="mobile"
                    label="Mobile Number"
                    value={data.mobile}
                    autoComplete="tel"
                    helperText={errors.mobile}
                    error={!!errors?.mobile}
                    disabled
                    fullWidth
                    required
                />
                <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Enter the 6-digit code sent to your mobile
                    </Typography>
                    <CodeField
                        length={6}
                        name="code"
                        value={data.code}
                        autoComplete="one-time-code"
                        isFocused={true}
                        onChange={setData}
                        required
                    />
                    {errors.code && (
                        <Typography variant="caption" color="error" align="center">
                            {errors.code}
                        </Typography>
                    )}
                </Stack>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        {showResend ? (
                            <Button
                                onClick={handleResendCode}
                                disabled={processing}
                                variant="outlined"
                                fullWidth
                            >
                                Resend Code
                            </Button>
                        ) : (
                            <>
                                <CountdownCircleTimer
                                    size={60}
                                    isPlaying
                                    duration={120}
                                    colors={['#004777']}
                                    onComplete={handleShowResend}
                                >
                                    {({remainingTime}) => (remainingTime / 60 | 0) + ":" + (remainingTime % 60).toString().padStart(2, '0')}
                                </CountdownCircleTimer>
                                <Typography variant="caption" color="text.secondary">
                                    Time remaining
                                </Typography>
                            </>
                        )}
                    </Stack>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={processing}
                        size="large"
                        sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                    >
                        {processing ? 'Verifying...' : 'Verify & Login'}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
}

Verify.layout = page => <GuestLayout children={page} head="Verify Mobile Number"/>

export default Verify;
