import React, {useEffect, useState} from 'react';

import {Inertia} from "@inertiajs/inertia";
import {Head, Link, useRemember} from "@inertiajs/react";

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Paper from "@mui/material/Paper";
import ListMenuItem from "./Components/MenuItem";
import AppBar from './Components/Appbar';
import Drawer from './Components/Drawer';
import Copyright from './Components/Copyright';
import Header from './Components/Header';
import {Backdrop, CircularProgress} from "@mui/material";


const renderMenu = (item, index, permissions, handleVisit) => {
    return (!item?.permission || permissions.includes(item.permission)) ?
        <ListMenuItem key={index} permissions={permissions} onClick={handleVisit} {...item}/> : null
}

export default function Authenticated({auth, breadcrumbs, children, head}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = useRemember(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.addEventListener('inertia:start', function () {
            setLoading(true);
        })
        document.addEventListener('inertia:finish', function () {
            setLoading(false)
        })
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleVisit = (addr) => e => {
        Inertia.visit(addr, {
            preserveState: true
        })
    };
    const routes = [];
    return (<>
            {head && <Head title={head}/>}
            <Box sx={{display: 'flex'}}>
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{pr: '24px'}}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            <Header breadcrumbs={breadcrumbs}/>
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>{auth.user.name}</MenuItem>
                            <MenuItem><Link href={route('logout')} method="post"> Logout</Link></MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: [1],
                        }}
                    >
                        <h3>{(auth.user?.name ?? auth.user?.mobile).toUpperCase()}</h3>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <List component="nav" sx={{maxHeight: "100%", overflowX: "hidden", overflowY: "auto"}}>
                        {routes.map((item, index) => renderMenu(item, index, auth.permissions, handleVisit))}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: 'calc(100vh - 55px)',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container sx={{mt: 4, mb: 4}} maxWidth={false}>
                        <Paper elevation={12} sx={{p: 5, borderRadius: "1em"}}>
                            {children}
                        </Paper>
                    </Container>
                </Box>
            </Box>
            <Copyright sx={{pt: 4}}/>
            <Backdrop open={loading}>
                <CircularProgress color={"info"}/>
            </Backdrop>
        </>
    );
}
