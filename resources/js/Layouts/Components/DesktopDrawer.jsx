import React from "react";
import {Divider, IconButton, List, Toolbar} from "@mui/material";
import {ChevronLeft as ChevronLeftIcon} from "@mui/icons-material";
import ListMenuItem from "@/Layouts/Components/MenuItem";
import Drawer from "@/Layouts/Components/Drawer";
import logo from "@/../images/logo.png";

const DesktopDrawer = ({toggleDrawer, list, onClick, permissions, open}) => {
    return <Drawer variant="permanent" open={open}>
        <Toolbar sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: [1],
        }}>
            <img src={logo} height={"50"}/>
            <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon/>
            </IconButton>
        </Toolbar>
        <Divider/>
        <List component="nav">
            {list.map((item, index) =><ListMenuItem key={index} onClick={onClick} {...item}/>)}
        </List>
    </Drawer>
}
export default DesktopDrawer;
