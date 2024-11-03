import {useSubmitForm} from "@/services/api";
import {
    Box,
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, FormControlLabel, FormHelperText,
    Grid,
    TextField
} from "@mui/material";
import React, {useState} from "react";
import {Save as SaveIcon} from "@mui/icons-material";
import LoadingButton from "../../Components/LoadingButton.jsx";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import SelectSearch from "../../Components/SelectSearch.jsx";
import dayjs from "dayjs";
import DeleteForm from "../../Components/DeleteForm.jsx";
import {router} from "@inertiajs/react";
import {useSnackbar} from "notistack";
import {convertValue} from "@/services/calendarHelpers.js";
import ToggleForm from "./ToggleForm.jsx";

const AddForm = ({
                     open,
                     onClose,
                     defaultValue,
                     disabledDoctor = false
                 }) => {
    const {enqueueSnackbar} = useSnackbar();
    const {
        data,
        submit,
        processing,
        handleChange,
        setData,
        errors,
        reset,
        clearErrors,
        setError
    } = useSubmitForm({
        ...defaultValue,
        _method: defaultValue.id ? "put" : "post"
    }, defaultValue.id ? route("admin.availableTimes.update", defaultValue.id) : route("admin.availableTimes.store"));

    const [openDelete, setOpenDelete] = useState(false)
    const handleClose = () => {
        onClose();
        reset();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        let isOk = true;
        if (!data.started_at) {
            setError("started_at", " the Started field is required ");
            isOk = false
        }
        if (!data.ended_at) {
            setError("ended_at", " the ended field is required ");
            isOk = false
        }
        if (data.started_at && data.ended_at && (convertValue(data.ended_at).toDate().getTime() <= convertValue(data.started_at).toDate().getTime())) {
            setError("started_at", " the tarted field must be  smaller than the ended ");
            setError("ended_at", " the ended field must be  grater than the started ");
        }
        if (!data.doctor) {
            setError("doctor", " Please Choose Doctor");
            isOk = false;
        }
        if (new Date(data.date).getTime() <= Date.now()) {
            setError("date", "Date must be grater than now");
            isOk = false;
        }

        if (isOk)
            submit({
                onSuccess: (e) => {
                    handleClose();
                    enqueueSnackbar(e?.props?.status, {variant: "success"});
                }
            });
    }
    const handleDateChange = (value) => {
        setData(prevData => ({...prevData, date: dayjs(value).format("YYYY-MM-DD")}))
    };
    const handleTimeChanged = (name) => v => setData(prevData => ({...prevData, [name]: dayjs(v).format("H:mm")}));
    const handleOnlyOnlineChanged = (_,v)=> setData(prevData => ({...prevData, only_online:v}));
    const onDelete = () => setOpenDelete(true);
    const closeDelete = () => setOpenDelete(false)
    const handleDelete = () => {
        router.post(route("admin.availableTimes.destroy", defaultValue.id), {
            _method: "delete"
        }, {
            onSuccess: (e) => {
                closeDelete();
                handleClose();
                enqueueSnackbar("Successfully Deleted", {variant: "info"});
            },
            onError: (obj) => {
                closeDelete();
                Object.keys(obj).forEach(key => enqueueSnackbar(obj[key], {variant: "error"}))
            }
        });
    }


    return <> <Dialog open={open} onClose={handleClose} keepMounted fullWidth maxWidth="xs">
        <DialogTitle>{data.id ? "Edit Doctor Available Time" : "Add Doctor Available Time"}</DialogTitle>
        <DialogContent>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{pt: "1em"}}
                action={data.id ? route("admin.doctors.update", data.id) : route("admin.doctors.store")}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                            <SelectSearch
                                label="Doctor"
                                value={data.doctor}
                                helperText={errors?.doctor}
                                name="doctor"
                                error={!!errors?.doctor}
                                onchange={handleChange}
                                required
                                disabled={disabledDoctor || !!defaultValue?.doctor}
                                url={route("doctors.list")}/>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors?.date}>
                                <DatePicker disablePast onChange={handleDateChange} closeOnSelect
                                            value={(dayjs(data.date))} sx={{width: "100%"}}/>
                                <FormHelperText error={!!errors?.date}>{errors?.date}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors?.started_at}>
                                <TimePicker ampm={false}
                                            slotProps={{digitalClockSectionItem: {sx: {"&.Mui-disabled": {display: "none"}}}}}
                                            sx={{width: "100%"}}
                                            onAccept={handleTimeChanged("started_at")}
                                            label="Started At"
                                            required
                                            value={convertValue(data?.started_at)}
                                            helperText={errors.started_at}
                                            error={!!errors.started_at}
                                            name="started_at"
                                            minutesStep={15}
                                            maxTime={dayjs(new Date(new Date().setHours(21)).setMinutes(0))}
                                            minTime={dayjs(new Date(new Date().setHours(9)).setMinutes(0))}/>
                                <FormHelperText error={!!errors?.started_at}>{errors?.started_at}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors?.ended_at}>
                                <TimePicker ampm={false}
                                            sx={{width: "100%"}}
                                            slotProps={{digitalClockSectionItem: {sx: {"&.Mui-disabled": {display: "none"}}}}}
                                            onAccept={handleTimeChanged("ended_at")}
                                            label="Ended At"
                                            required
                                            value={convertValue(data?.ended_at)}
                                            helperText={errors.ended_at}
                                            error={!!errors.ended_at}
                                            name="ended_at"
                                            minutesStep={15}
                                            maxTime={dayjs(new Date(new Date().setHours(21)).setMinutes(0))}
                                            minTime={dayjs(new Date(new Date().setHours(9)).setMinutes(0))}/>
                                <FormHelperText error={!!errors?.ended_at}>{errors?.ended_at}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControlLabel control={<Checkbox />} label="Only Online ?" checked={data.only_online} onChange={handleOnlyOnlineChanged} />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Box>
        </DialogContent>
        <DialogActions>
            {defaultValue?.id && <>
                <ToggleForm onAgree={handleClose} availableTime={defaultValue}/>
                <Button
                    onClick={onDelete}
                    disabled={processing}
                    variant="text"
                    color="error"
                    size="large"

                >Delete</Button>
            </>
            }
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
    </Dialog>
        <DeleteForm openDelete={openDelete} agreeCB={handleDelete} disAgreeCB={closeDelete}
                    title={"Available Time" + defaultValue?.doctor?.title}/>
    </>;
}
export default AddForm;
