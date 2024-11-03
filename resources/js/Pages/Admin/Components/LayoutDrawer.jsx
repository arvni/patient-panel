import React from "react";
import {
    Badge,
    Divider,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Toolbar
} from "@mui/material";
import {ChevronLeft as ChevronLeftIcon} from "@mui/icons-material";
import {drawerWidth} from "@/Layouts/AdminLayout.jsx";


const ListItem = (props) => {
    return <ListItemButton  href={props.link} onClick={props.onClick}>
        <ListItemIcon>
            <Badge badgeContent={props?.count||0} color="secondary">
            {props.icon}
            </Badge>
        </ListItemIcon>
    <ListItemText primary={props.label} />
</ListItemButton>;
};

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);


const LayoutDrawer = ({
                          open,
                          setOpen,
                          list = []
                      }) => {

    const toggleDrawer = () => {
        setOpen(!open);
    };


    return <Drawer variant="permanent" open={open}>
        <Toolbar sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
        }}>
            <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon/>
            </IconButton>
        </Toolbar>
        <Divider/>
        <List component="nav">
            {list.map((item, index) => <ListItem {...item} key={index}/>)}
            <Divider sx={{my: 1}}/>
        </List>
    </Drawer>;
}

export default LayoutDrawer;
