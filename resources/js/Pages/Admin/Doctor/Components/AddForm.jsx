import {useSubmitForm} from "@/services/api";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack, Tab, Tabs,
    TextField
} from "@mui/material";
import React, {useState} from "react";
import {Save as SaveIcon} from "@mui/icons-material";

import LoadingButton from "../../Components/LoadingButton.jsx";
import AvatarUpload from "../../Components/AvatarUpload.jsx";
import WeeklySchedule from "./WeeklySchedule.jsx";


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (<>{children}</>)}
        </div>
    );
}

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
        setData,
        errors,
        reset,
        clearErrors
    } = useSubmitForm({
        ...defaultValue,
        default_time_table: defaultValue.default_time_table || Array.from({length: 7}, () => []),
        _method: defaultValue.id ? "put" : "post"
    }, defaultValue.id ? route("admin.doctors.update", defaultValue.id) : route("admin.doctors.store"));

    const [activeTab, setActiveTab] = useState(0);
    const handleClose = () => {
        onClose();
        reset();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        submit({onSuccess: handleClose});
    }
    const handleImageChange = (res) => setData(prevValues => ({...prevValues, image: res.data.src}));
    const handleTabChanged = (_, value) => setActiveTab(value);

    const handleChangeWeekTimes = (timeSlot) => {
        let default_time_table = [...data.default_time_table];
        let index = default_time_table[timeSlot?.day].findIndex((item) => item.id === timeSlot.id);
        if (index < 0)
            default_time_table[timeSlot?.day] = [...default_time_table[timeSlot?.day], timeSlot];
        else
            default_time_table[timeSlot?.day][index] = timeSlot;
        setData(prevData => ({...prevData, default_time_table}));
    }
    const handleDeleteWeekTimes = (timeSlot, cb) => {
        let index = data.default_time_table[timeSlot?.day].findIndex((item) => item.id === timeSlot.id);
        if (index >= 0) {
            let default_time_table = [...data.default_time_table];
            default_time_table[timeSlot?.day].splice(index, 1);
            setData(prevData => ({...prevData, default_time_table}));
        }
        cb();

    }

    return <Dialog open={open}
                   onClose={handleClose}
                   keepMounted
                   fullWidth
                   maxWidth="sm">
        <DialogTitle>{data.id ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
            <Box component="form"
                 onSubmit={handleSubmit}
                 sx={{pt: "1em", bgcolor: 'background.paper', display: 'flex', justifyContent: "space-evenly"}}
                 action={data.id ? route("admin.doctors.update", data.id) : route("admin.doctors.store")}>
                <Tabs value={activeTab}
                      onChange={handleTabChanged}
                      aria-label="basic tabs example"
                      orientation="vertical">
                    <Tab label="Main Information" value={0}/>
                    <Tab label="Default Schedule" value={1}/>
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                    <Stack spacing={2} justifyContent="center">
                        <AvatarUpload value={data.image}
                                      name={"image"}
                                      onChange={handleImageChange}
                                      error={errors?.hasOwnProperty("image")}
                                      helperText={errors?.image}
                                      uploadUrl={route("admin.uploadImage")}/>
                        <TextField
                            fullWidth
                            name="title"
                            value={data.title ?? ""}
                            helperText={errors.title}
                            error={!!errors.title}
                            onChange={handleChange}
                            label="Title"
                            required
                        />
                        <TextField
                            fullWidth
                            name="subtitle"
                            value={data.subtitle ?? ""}
                            helperText={errors.subtitle}
                            error={!!errors.subtitle}
                            onChange={handleChange}
                            label="Subtitle"
                            required
                        />
                        <TextField
                            fullWidth
                            name="specialty"
                            value={data.specialty ?? ""}
                            helperText={errors.specialty}
                            error={!!errors.specialty}
                            onChange={handleChange}
                            label="Specialty"
                            required
                        />
                    </Stack>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <WeeklySchedule data={data.default_time_table}
                                    onChange={handleChangeWeekTimes}
                                    onDeleteTimeSlot={handleDeleteWeekTimes}/>
                </TabPanel>
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
