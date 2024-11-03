import React from "react";
import {Alert, Button, Paper, Stack, Chip} from "@mui/material";
import PageHeader from "../Components/PageHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import TimeCard from "../Components/TimeCard.jsx";

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Typography from '@mui/material/Typography';


const Show = ({auth, reservation, status}) => {
    const handleClick=(id)=>()=>window.open(route("admin.download",id), "_blank");
    return (
        <AdminLayout user={auth.user} header="Reservations">
            {status && <Alert>{status}</Alert>}
            <PageHeader title="Reservations"/>
            <Paper sx={{mt: "3em", p: "1rem", overflowX: "auto"}}>
                <TimeCard time={reservation.time}/>

                {reservation.type == 2 && reservation?.information?.room ? <Stack direction="row" spacing={2}>
                    <Button href={reservation.information.room.data.start_url} target="_blank">Join as Doctor</Button>
                    <Button href={reservation.information.room.data.join_url} target="_blank">Join as Patient</Button>
                </Stack> : null}
                <h3>Whatsapp Messages</h3>
                <Timeline position="alternate">
                    {reservation?.customer?.whatsapp_messages?.map(message => <TimelineItem key={message.id}>
                        <TimelineOppositeContent
                            sx={{m: 'auto 0'}}
                            align={message.type === "input" ? "right" : "left"}
                            variant="body2"
                            color="text.secondary"
                        >
                            {new Date(message.created_at).toLocaleDateString()+" "+new Date(message.created_at).toLocaleTimeString()}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector/>
                            <TimelineConnector/>
                        </TimelineSeparator>
                        <TimelineContent sx={{py: '12px', px: 2}}>
                            <Typography variant="h6" component="span">
                                {message.type === "input" ? reservation.customer.name : "system"}
                            </Typography>
                            <Typography>{message.body}</Typography>
                            {message.files?.length ? <>
                                    <h6>Files</h6>
                                <Stack direction="row" spacing={1}>
                                    {message.files.map((file, index) =><Chip label={index+1} onClick={handleClick(file.id)} />)}
                                </Stack>
                            </> : null}
                        </TimelineContent>
                    </TimelineItem>)}
                </Timeline>

            </Paper>
        </AdminLayout>
    );
};

export default Show;
