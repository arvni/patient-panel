import {
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    EventAvailable as EventAvailableIcon,
    DateRange as DateRangeIcon
} from "@mui/icons-material";


import {useChangePage} from "../services/api";
import useSWR from "swr";
import React, {useEffect, useState} from "react";
import {Head} from "@inertiajs/react";
import {
    Backdrop,
    Box, CircularProgress,
    createTheme,
    CssBaseline, Stack,
    ThemeProvider,
    Toolbar,
} from "@mui/material";

import Header from "../Pages/Admin/Components/Header";
import Copyright from "../Pages/Admin/Components/Copyright";
import ChangePasswordForm from "../Pages/Admin/Components/ChangePasswordForm";


import LayoutDrawer from "../Pages/Admin/Components/LayoutDrawer";

const defaultTheme = createTheme();
export const drawerWidth = 240;

export default function AdminLayout({children, header, user}) {
    const {get, processing} = useChangePage();
    const {data, error} = useSWR(route("admin.reservations.count"), null, {});
    const handlePage = (e) => {
        e.preventDefault();
        get(e.currentTarget.getAttribute("href") + "");
    };
    const list = [
        {
            link: route("admin.dashboard"),
            label: "Dashboard",
            icon: <DashboardIcon/>,
            onClick: handlePage
        },
        {
            link: route("admin.reservations.index"),
            label: "Reservations",
            count: data?.reserved || 0,
            icon: <EventAvailableIcon/>,
            onClick: handlePage
        },
        {
            link: route("admin.times.index"),
            label: "Times",
            icon: <EventAvailableIcon/>,
            onClick: handlePage
        },
        {
            link: route("admin.availableTimes.index"),
            label: "Available Days",
            icon: <DateRangeIcon/>,
            onClick: handlePage
        },
        {
            link: route("admin.doctors.index"),
            label: "Doctors",
            icon: <GroupIcon/>,
            onClick: handlePage
        },
        {
            link: route("admin.users.index"),
            label: "Users",
            icon: <GroupIcon/>,
            onClick: handlePage
        }
    ];
    const [open, setOpen] = React.useState(true);
    const [openChangePasswordForm, setOpenChangePasswordForm] = React.useState(false);

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        document.addEventListener('inertia:start', function () {
            setLoading(true);
        })
        document.addEventListener('inertia:finish', function () {
            setLoading(false)
        })
    }, []);

    const handleOpenChangePasswordForm = () => {
        setOpenChangePasswordForm(true);
    }
    const handleCloseChangePasswordForm = () => {
        setOpenChangePasswordForm(false);
    }

    const handleLogout = () => {
        get(route("logout"));
    }
    return (
        <ThemeProvider theme={defaultTheme}>
            <Head title={header}/>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <Header open={open}
                        setOpen={setOpen}
                        user={user} handleLogout={handleLogout}
                        handleOpenChangePassword={handleOpenChangePasswordForm}
                        headerTitle={header}/>
                <LayoutDrawer open={open}
                              setOpen={setOpen}
                              list={list}/>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Box sx={{m: 4}}>
                        {children}
                        <Copyright sx={{pt: 4}}/>
                    </Box>
                </Box>
            </Box>
            <ChangePasswordForm open={openChangePasswordForm} onClose={handleCloseChangePasswordForm}/>
            <Backdrop open={processing || loading} sx={{zIndex: defaultTheme.zIndex.modal + 10}}>
                <Stack direction="column" justifyContent="center" spacing={2}>
                    <CircularProgress/>
                </Stack>
            </Backdrop>
        </ThemeProvider>
    );
}

