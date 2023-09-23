import GuestLayout from '@/Layouts/GuestLayout';
import {useForm} from '@inertiajs/react';
import {Button, Stack, TextField} from "@mui/material";
import CodeField from "@/Components/CodeField";

function Verify({mobile,...props}) {
    const {data, setData, post, processing, errors} = useForm({
        code: '',
        mobile
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('verify'));
    };
    console.log(props);
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
                <Button variant="contained" type="submit" disabled={processing}>
                    Log in
                </Button>
            </Stack>
        </form>
    );
}

Verify.layout = page => <GuestLayout children={page} head="Verify Mobile Number"/>

export default Verify;
