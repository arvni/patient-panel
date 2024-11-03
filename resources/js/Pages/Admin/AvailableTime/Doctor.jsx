import React, {useState} from "react";
import {Alert, Avatar, Button, Paper, Stack} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PageHeader from "../Components/PageHeader";
import AddForm from "./Components/AddForm";
import AdminLayout from "@/Layouts/AdminLayout";
import FullCalendar from "../Components/FullCalendar.jsx";
import {router} from "@inertiajs/react";
import dayjs from "dayjs";

const defaultAvailableTime = {
    date: new Date(),
    started_at: "",
    ended_at: "",
}

const Doctor = ({auth, availableTimes, doctor, status, request}) => {
    const [availableTime, setAvailableTime] = useState({...defaultAvailableTime, doctor});
    const [openAddForm, setOpenAddForm] = useState(false);
    const handleOpenAddForm = () => setOpenAddForm(true);
    const handleCloseAddForm = () => {
        setOpenAddForm(false);
        resetAvailableTime();
    };
    const resetAvailableTime = () => {
        setAvailableTime({...defaultAvailableTime, doctor});
    };

    const handleNavigate = (date, view) => {
        let data = {
            ...request,
            date: dayjs(date).format("YYYY-MM-DD"),
            view
        }
        router.visit(route("admin.doctors.availableTimes", doctor.id), {
            data,
            only: ["availableTimes","request"],
            preserveState: false
        })
    }

    const handleEdit = () => {

    };

    const handleShowTime = event => {
        setAvailableTime(event);
        setOpenAddForm(true);
    }

    const convertedAvailableTimes = availableTimes.map(item => ({
        ...item,
        started: new Date(item.started),
        ended: new Date(item.ended)
    }));
    return (
        <AdminLayout user={auth.user} header={doctor.title + " Available Times"}>
            {status && <Alert>{status}</Alert>}
            <PageHeader
                title={<Stack direction="row" alignContent="center" alignItems="center" spacing={2}>
                    <Avatar src={doctor.image}/>
                    <span>{doctor.title + " Available Times"}</span>
                </Stack>}
                actions={[
                    <Button variant="contained" onClick={handleOpenAddForm} color="success" startIcon={<AddIcon/>}>
                        Add
                    </Button>
                ]}
            />
            <Paper sx={{mt: "3em", p: "1rem"}}>
                <FullCalendar
                    events={convertedAvailableTimes}
                    onSelectEvent={handleShowTime}
                    onNavigate={handleNavigate}
                    onView={(view) => handleNavigate(request.date, view)}
                    defaultDate={new Date(request.date)}
                    defaultView={request.view}/>
            </Paper>
            {openAddForm && <AddForm
                open={openAddForm}
                onClose={handleCloseAddForm}
                defaultValue={availableTime}
                disabledDoctor
            />}
        </AdminLayout>
    );
};

export default Doctor;
