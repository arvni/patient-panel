import React, {useEffect, useState} from 'react';
import {
    Paper,
    Box,
    Toolbar,
    Container
} from "@mui/material";

import Copyright from './Components/Copyright';

import AppMenu from "@/Layouts/Components/AppMenu";
import Loading from "@/Components/Loading";
import {AddIcCall, Logout, Vaccines} from "@mui/icons-material";
import {Head, router} from "@inertiajs/react";
import {CalendarIcon} from "@mui/x-date-pickers";


export default function Authenticated({auth, breadcrumbs, children, head}) {
    const [loading, setLoading] = useState(false);
    const handleVisit = (href) => router.visit(route(href));
    useEffect(() => {
        document.addEventListener('inertia:start', function () {
            setLoading(true);
        })
        document.addEventListener('inertia:finish', function () {
            setLoading(false)
        })
    }, []);
    const routes = [
        {
            title: "Test List",
            href: 'acceptances.index',
            icon: <Vaccines/>,
        },
        {
            title: "Reservation List",
            href: 'reservations.index',
            icon: <CalendarIcon/>,
        },
        {
            title: "Book an appointment",
            href: 'reservations.create',
            icon: <AddIcCall/>,
        },
        {
            title: "Logout",
            href: 'logout',
            icon: <Logout/>,
        },
    ];
    return (<>
            {head && <Head title={head}/>}
            <Box sx={{display: 'flex'}}>
                <AppMenu list={routes} permissions={auth.permissions} userName={auth.user.name}
                         breadcrumbs={breadcrumbs} handleVisit={handleVisit}/>
                <Box component="main" sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'calc(100vh - 55px)',
                    overflow: 'auto',
                }}>
                    <Toolbar/>
                    <Container sx={{mt: 4, mb: 4,}} maxWidth={false}>
                        <Paper elevation={12}
                               sx={{p: 2, borderRadius: "1em", overflowX: "auto", minHeight: "max-content"}}>
                            {children}
                        </Paper>
                    </Container>
                </Box>
            </Box>
            <Copyright sx={{pt: 4}}/>
            <Loading open={loading}/>
        </>
    )
        ;
}
