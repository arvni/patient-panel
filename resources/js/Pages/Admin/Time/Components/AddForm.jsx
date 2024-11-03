import React from "react";
import {
    Dialog,
    DialogContent,
} from "@mui/material";
import TimeCard from "../../Components/TimeCard";

const AddForm = ({
                     open,
                     onClose,
                     defaultValue,
                 }) => {
    const handleClose = () => onClose();

    return <> <Dialog open={open} onClose={handleClose} keepMounted fullWidth maxWidth="xs">
        <DialogContent>
            <TimeCard time={defaultValue}/>
        </DialogContent>
    </Dialog>
    </>

}
export default AddForm;
