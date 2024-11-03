import React, {useState} from "react";
import {Alert, Button, Paper} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import PageHeader from "../Components/PageHeader";
import AddForm from "./Components/AddForm";
import AdminLayout from "@/Layouts/AdminLayout";
import FullCalendar from "../Components/FullCalendar.jsx";
import {router} from "@inertiajs/react";
import dayjs from "dayjs";


const Index = ({auth, availableTimes, status, request}) => {
    const defaultAvailableTime = {
        date: new Date(request.date),
        started_at: "",
        ended_at: "",
    }
    const [availableTime, setAvailableTime] = useState(defaultAvailableTime);
    const [openAddForm, setOpenAddForm] = useState(false);
    const handleOpenAddForm = () => setOpenAddForm(true);
    const handleCloseAddForm = () => {
        setOpenAddForm(false);
        resetAvailableTime();
    };
    const resetAvailableTime = () => setAvailableTime(defaultAvailableTime);

    const handleView=(view)=>handleNavigate(request.date, view)

    const handleNavigate = (date, view) => {
        let data = {
            ...request,
            date: dayjs(date).format("YYYY-MM-DD"),
            view
        }
        router.visit(route("admin.availableTimes.index"), {
            data,
            only: ["availableTimes","request"],
            preserveState: false
        })
    }

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
        <AdminLayout user={auth.user} header="Available Times" >
            {status && <Alert>{status}</Alert>}
            <PageHeader
                title="Available Times"
                actions={[
                    <Button
                        variant="contained"
                        onClick={handleOpenAddForm}
                        color="success"
                        startIcon={<AddIcon/>}>Add</Button>
                ]}
            />
            <Paper sx={{mt: "3em", p: "1rem"}}>
                <FullCalendar
                    events={convertedAvailableTimes}
                    onSelectEvent={handleShowTime}
                    onNavigate={handleNavigate}
                    onView={handleView}
                    defaultDate={new Date(request.date)}
                    defaultView={request.view}/>
            </Paper>
            {openAddForm &&
                <AddForm
                    open={openAddForm}
                    onClose={handleCloseAddForm}
                    defaultValue={availableTime}
                />}
        </AdminLayout>
    );
};

export default Index;
