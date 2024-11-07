import AppBar from "@/Layouts/Components/AppBar";
import {Avatar, Box, IconButton, Toolbar} from "@mui/material";
import React from "react";
import logo from "@/../images/mobile-logo.png";

const MobileMenu = ({list, onClick, permissions}) => {
    const handleOnClick = (href) => (e) => {
        e.preventDefault();
        onClick(href);
    }
    return <>
        <AppBar position="fixed" color="primary" sx={{top: 0}}>
            <Toolbar sx={{justifyContent:"center"}}>
                <Avatar src={logo} />
            </Toolbar>
        </AppBar>
        <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
        <Toolbar sx={{justifyContent: "space-evenly", alignItems: "center", alignContent: "center"}}>
            {list.map((item, index) =><React.Fragment key={index}>
                    {index==Math.floor(list.length/2)?<Box width={"56px"}/>:null}
                    <IconButton onClick={handleOnClick(item.href)} href={route(item.href)}
                            sx={{color: "white"}}>
                    {item.icon}
                </IconButton></React.Fragment>)}
        </Toolbar>
    </AppBar>
    </>
}
export default MobileMenu
