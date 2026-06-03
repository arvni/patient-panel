import React, {useEffect, useState} from 'react';
import {
    Paper,
    Box,
    Toolbar,
    Container,
    Snackbar,
    Alert
} from "@mui/material";

import Copyright from './Components/Copyright';

import AppMenu from "@/Layouts/Components/AppMenu";
import Loading from "@/Components/Loading";
import {
    Logout,
    Home,
    Biotech,
    EventNote,
    AddCircleOutline
} from "@mui/icons-material";
import {Head, router, usePage} from "@inertiajs/react";


export default function Authenticated({auth, breadcrumbs, children, head}) {
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const { flash } = usePage().props;
    const handleVisit = (href) => router.visit(route(href));

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setNotification({ open: true, message: flash.success, severity: 'success' });
        } else if (flash?.error) {
            setNotification({ open: true, message: flash.error, severity: 'error' });
        } else if (flash?.warning) {
            setNotification({ open: true, message: flash.warning, severity: 'warning' });
        } else if (flash?.info) {
            setNotification({ open: true, message: flash.info, severity: 'info' });
        }
    }, [flash]);

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification({ ...notification, open: false });
    };
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
            title: "Home",
            href: 'dashboard',
            icon: <Home fontSize="medium" />,
        },
        {
            title: "My Appointments",
            href: 'reservations.index',
            icon: <EventNote fontSize="medium" />,
        },
        {
            title: "Book Appointment",
            href: 'reservations.create',
            icon: <AddCircleOutline fontSize="medium" />,
        },
        {
            title: "Lab Results",
            href: 'acceptances.index',
            icon: <Biotech fontSize="medium" />,
        },
        {
            title: "Logout",
            href: 'logout',
            icon: <Logout fontSize="medium" />,
        },
    ];
    return (<>
            {head && <Head title={head}/>}
            <Box sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden'
            }}>
                <AppMenu list={routes} permissions={auth.permissions} userName={auth.user.name}
                         breadcrumbs={breadcrumbs} handleVisit={handleVisit}/>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        // Account for mobile fixed header/footer
                        pt: { xs: '56px', sm: 0 },
                        pb: { xs: '56px', sm: 0 },
                    }}
                >
                    <Toolbar sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }} />
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Container
                            sx={{
                                flexGrow: 1,
                                py: { xs: 2, md: 3 },
                                px: { xs: 1, sm: 2, md: 3 },
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            maxWidth={false}
                        >
                            <Paper
                                elevation={12}
                                sx={{
                                    p: { xs: 1.5, sm: 2, md: 3 },
                                    borderRadius: "1em",
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'auto',
                                }}
                            >
                                {children}
                            </Paper>
                        </Container>
                        <Copyright sx={{
                            py: 2,
                            px: 3,
                            flexShrink: 0,
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                        }}/>
                    </Box>
                </Box>
            </Box>
            <Loading open={loading}/>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ mt: { xs: 7, sm: 2 } }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        minWidth: { xs: '280px', sm: '400px' },
                        boxShadow: 4,
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
}
