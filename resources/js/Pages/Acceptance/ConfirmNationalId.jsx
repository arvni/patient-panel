import Authenticated from "@/Layouts/AuthenticatedLayout";
import {router, useForm} from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import {CheckCircle, Person} from "@mui/icons-material";

const Row = ({label, value}) => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value ?? "—"}</Typography>
    </Stack>
);

const ConfirmNationalId = ({nationalId, patient}) => {
    const {post, processing} = useForm({
        national_id: nationalId,
    });

    const confirm = (e) => {
        e.preventDefault();
        post(route("acceptances.nationalId.store"));
    };

    const cancel = () => router.visit(route("acceptances.nationalId.create"));

    return (
        <Box sx={{maxWidth: 480, mx: "auto"}}>
            <Card elevation={2}>
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={1} alignItems="center">
                            <Person color="primary" sx={{fontSize: 48}}/>
                            <Typography variant="h6" fontWeight={600}>
                                Is this the correct patient?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                We found the following patient for this National ID. Confirm to view their lab results.
                            </Typography>
                        </Stack>

                        <Divider/>

                        <Stack spacing={1.5}>
                            <Row label="Full name" value={patient?.fullName}/>
                            <Row label="National ID" value={nationalId}/>
                            <Row label="Date of birth" value={patient?.dateOfBirth}/>
                            <Row label="Available results" value={patient?.acceptancesCount}/>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button onClick={cancel} variant="outlined" fullWidth disabled={processing}>
                                No, go back
                            </Button>
                            <form onSubmit={confirm} style={{width: "100%"}}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={processing}
                                    startIcon={processing ? <CircularProgress size={20} color="inherit"/> :
                                        <CheckCircle/>}
                                >
                                    {processing ? "Loading..." : "Yes, that's correct"}
                                </Button>
                            </form>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

ConfirmNationalId.layout = page => <Authenticated auth={page.props.auth}
                                                  breadcrumbs={[{title: "Lab Results", link: route("acceptances.index")}, {title: "Confirm patient"}]}
                                                  children={page} head={"Confirm patient"}/>;
export default ConfirmNationalId;
