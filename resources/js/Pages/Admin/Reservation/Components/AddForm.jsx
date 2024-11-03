import {useSubmitForm} from "@/services/api";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";
import React from "react";
import {Save as SaveIcon} from "@mui/icons-material";
import PasswordField from "@/Components/PasswordField";
import LoadingButton from "@/Components/LoadingButton.jsx";

const AddForm = ({
                     open,
                     onClose,
                     defaultValue
                 }) => {
    const {
        data,
        submit,
        processing,
        handleChange,
        errors,
        reset,
        clearErrors
    } = useSubmitForm({
        ...defaultValue,
        _method: defaultValue.id ? "put" : "post"
    }, defaultValue.id ?route("admin.users.update",defaultValue.id) :route("admin.users.store"));

    const handleClose = () => {
        onClose();
        reset();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        // if (storeSampleTypeValidator(data, setError))
        submit({onSuccess: handleClose});
    }

    return <Dialog open={open} onClose={handleClose} keepMounted fullWidth maxWidth={"lg"}>
        <DialogTitle>{data.id ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{pt: "1em"}}
                action={data.id ? route("admin.users.update",data.id) : route("admin.users.store")}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            fullWidth
                            name="name"
                            value={data.name ?? ""}
                            helperText={errors.name}
                            error={!!errors.name}
                            onChange={handleChange}
                            label="Name"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            fullWidth
                            name="email"
                            value={data.email ?? ""}
                            helperText={errors.email}
                            error={!!errors.email}
                            onChange={handleChange}
                            label="Email"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            fullWidth
                            name="userName"
                            value={data.userName ?? ""}
                            helperText={errors.userName}
                            error={!!errors.userName}
                            onChange={handleChange}
                            label="UserName"
                            required
                        />
                    </Grid>
                    {!defaultValue.id && <>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <PasswordField
                                name="password"
                                value={data.password ?? ""}
                                helperText={errors.password}
                                error={!!errors.password}
                                onChange={handleChange}
                                label="Password"
                                fullwidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <PasswordField
                                name="password_confirmation"
                                value={data.password_confirmation ?? ""}
                                helperText={errors.password_confirmation}
                                error={!!errors.password_confirmation}
                                onChange={handleChange}
                                fullwidth
                                label="Password Confirmation"
                                required
                            />
                        </Grid>
                    </>}

                </Grid>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={handleClose}
                disabled={processing}
                variant="text"
                size="large"
            >Cancel</Button>
            <LoadingButton
                onClick={handleSubmit}
                loading={processing}
                size="medium"
                variant="contained"
                type="submit"
                startIcon={<SaveIcon/>}
            >Submit</LoadingButton>
        </DialogActions>
    </Dialog>;
}
export default AddForm;
