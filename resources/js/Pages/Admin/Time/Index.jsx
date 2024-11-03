import React, {useState} from "react";
import {Alert, Paper} from "@mui/material";
import PageHeader from "../Components/PageHeader";
import AddForm from "./Components/AddForm";
import AdminLayout from "@/Layouts/AdminLayout";
import FullCalendar from "../Components/FullCalendar.jsx";
import {router} from "@inertiajs/react";
import dayjs from "dayjs";

const defaultTime = {
}

const Index = ({auth, times, status, request}) => {

    const [time, setTime] = useState(defaultTime);
    const [openAddForm, setOpenAddForm] = useState(false);
    const handleCloseAddForm = () => {
        setOpenAddForm(false);
        resetTime();
    };
    const resetTime = () => {
        setTime(defaultTime);
    };

    const handleNavigate = (date, view) => {
        let data = {
            ...request,
            date: dayjs(date).format("YYYY-MM-DD"),
            view
        }
        router.visit(route("admin.times.index"), {
            data,
            only: ["times","request","status"],
            preserveState: false
        })
    }

    const handleShowTime = event => {
        axios.get(route("admin.times.show",event.id)).then(({data})=>setTime(data.data));
        setOpenAddForm(true);
    }

    const convertedTimes = times.map(item => ({
        ...item,
        started: new Date(item.started),
        ended: new Date(item.ended)
    }));
    return (
        <AdminLayout user={auth.user} header=" Times" >
            {status && <Alert>{status}</Alert>}
            <PageHeader title=" Times" />
            <Paper sx={{mt: "3em", p: "1rem"}}>
                <FullCalendar
                    events={convertedTimes}
                    onSelectEvent={handleShowTime}
                    onNavigate={handleNavigate}
                    onView={(view) => handleNavigate(request.date, view)}
                    defaultDate={new Date(request.date)}
                    defaultView={request.view}/>
            </Paper>
            {openAddForm &&
                <AddForm
                    open={openAddForm}
                    onClose={handleCloseAddForm}
                    defaultValue={time}
                />}
        </AdminLayout>
    );
};

export default Index;
