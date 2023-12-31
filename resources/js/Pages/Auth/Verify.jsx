import GuestLayout from '@/Layouts/GuestLayout';
import {useForm} from '@inertiajs/react';
import {Button, Stack, TextField} from "@mui/material";
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
        <form onSubmit={submit}>
            <Stack spacing={2}>
                <TextField name="mobile"
                           label="Mobile"
                           value={data.mobile}
                           autoComplete="mobile"
                           helperText={errors.mobile}
                           error={errors?.mobile}
                           disabled
                           required/>
                <CodeField length={6}
                           name="code"
                           value={data.code}
                           autoComplete="code"
                           isFocused={true}
                           onChange={setData}
                           required/>
                <Stack direction={"row"} spacing={4} alignItems={"center"} justifyContent={"space-between"}>
                    {showResend ? <Button onClick={handleResendCode}>Resend Code</Button> : <CountdownCircleTimer
                        size={70}
                        isPlaying
                        duration={120}
                        colors={['#004777']} onComplete={handleShowResend}
                    >
                        {({remainingTime}) => (remainingTime / 60 | 0) + ":" + remainingTime % 60}
                    </CountdownCircleTimer>}
                    <Button variant="contained" type="submit" disabled={processing}>
                        Log in
                    </Button>

                </Stack>
            </Stack>
        </form>
    );
}

Verify.layout = page => <GuestLayout children={page} head="Verify Mobile Number"/>

export default Verify;
