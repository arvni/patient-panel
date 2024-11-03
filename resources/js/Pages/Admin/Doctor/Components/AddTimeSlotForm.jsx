import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    Grid
} from "@mui/material";
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, {useState} from "react";
import PropTypes from "prop-types";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {convertValue, getDayjs} from "@/services/calendarHelpers.js";
import DeleteForm from "../../Components/DeleteForm.jsx";


const minTime = getDayjs(9);
const maxTime = getDayjs(21);
const AddTimeSlotForm = ({open, setData, data, title, onClose, onsubmit,onDelete}) => {
    const [openDeleteForm, setOpenDeleteForm] = useState(false)
    const handleSubmit = () => {
        if (data.started_at && data.ended_at && (convertValue(data.ended_at).toDate().getTime() > convertValue(data.started_at).toDate().getTime()))
            onsubmit()
    }
    const handleChange = (name) => v => setData(prevData => ({...prevData, [name]: dayjs(v).format("H:mm")}));
    const handleOnlyOnlineChanged = (_,v)=> setData(prevData => ({...prevData, only_online:v}));
    const handleOpenDelete=()=>setOpenDeleteForm(true);
    const handleCloseDelete=()=>setOpenDeleteForm(false);
    const handleDelete=()=>{
        onDelete();
        handleCloseDelete();
    }
    return <>
        <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container mt={2}>
                    <Grid item xs={12} sm={5}>
                        <TimePicker ampm={false}
                                    slotProps={{digitalClockSectionItem: {sx: {"&.Mui-disabled": {display: "none"}}}}}
                                    sx={{width: "100%"}}
                                    onAccept={handleChange("started_at")}
                                    label="Started At"
                                    required
                                    value={convertValue(data?.started_at)}
                                    name="started_at"
                                    minutesStep={15}
                                    maxTime={maxTime}
                                    minTime={minTime}/>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <TimePicker ampm={false}
                                    sx={{width: "100%"}}
                                    slotProps={{digitalClockSectionItem: {sx: {"&.Mui-disabled": {display: "none"}}}}}
                                    onAccept={handleChange("ended_at")}
                                    label="Ended At"
                                    required
                                    value={convertValue(data?.ended_at)}
                                    name="ended_at"
                                    minutesStep={15}
                                    maxTime={maxTime}
                                    minTime={minTime}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <FormControlLabel control={<Checkbox />} label="Only Online" checked={data.only_online} onChange={handleOnlyOnlineChanged} />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleOpenDelete} color="error" variant="outlined">Delete</Button>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
    </Dialog>
        <DeleteForm openDelete={openDeleteForm} title="Time Slot" disAgreeCB={handleCloseDelete} agreeCB={handleDelete}/>
        </>
}

AddTimeSlotForm.propTypes = {
    open: PropTypes.bool.isRequired,
    setData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onsubmit: PropTypes.func.isRequired,
};
export default AddTimeSlotForm;
