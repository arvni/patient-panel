import Authenticated from "@/Layouts/AuthenticatedLayout";
import {useForm} from "@inertiajs/react";
import {Alert, Box, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography} from "@mui/material";
import {Badge} from "@mui/icons-material";

const AddNationalId = () => {
    const {data, setData, post, processing, errors} = useForm({
        national_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("acceptances.nationalId.lookup"));
    };

    return (
        <Box sx={{maxWidth: 480, mx: "auto"}}>
            <Card elevation={2}>
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={1} alignItems="center">
                            <Badge color="primary" sx={{fontSize: 48}}/>
                            <Typography variant="h6" fontWeight={600}>
                                Add a National ID
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Enter the National ID to look up the patient registered under your phone number.
                            </Typography>
                        </Stack>

                        {errors.national_id && <Alert severity="error">{errors.national_id}</Alert>}

                        <form onSubmit={submit}>
                            <Stack spacing={2}>
                                <TextField
                                    name="national_id"
                                    label="National ID"
                                    placeholder="Enter National ID"
                                    value={data.national_id}
                                    onChange={(e) => setData("national_id", e.target.value)}
                                    error={!!errors.national_id}
                                    inputMode="numeric"
                                    autoFocus
                                    required
                                    fullWidth
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={processing}
                                    startIcon={processing ? <CircularProgress size={20} color="inherit"/> : null}
                                    fullWidth
                                >
                                    {processing ? "Looking up..." : "Look up patient"}
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

AddNationalId.layout = page => <Authenticated auth={page.props.auth}
                                              breadcrumbs={[{title: "Lab Results", link: route("acceptances.index")}, {title: "Add National ID"}]}
                                              children={page} head={"Add National ID"}/>;
export default AddNationalId;
