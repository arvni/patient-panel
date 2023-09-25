import DesktopHeaderMenu from "@/Layouts/Components/DesctopHeaderMenu";
import DesktopDrawer from "@/Layouts/Components/DesktopDrawer";
import React, {useEffect} from "react";
import {useMediaQuery} from "@mui/material";
import {useRemember} from "@inertiajs/react";

const DesktopMenu = ({breadcrumbs, onClick, userName, permissions, list}) => {
    const openDefaultDrawer = useMediaQuery("(min-width:900px)", {noSsr: true});
    const [open, setOpen] = useRemember(openDefaultDrawer);
    useEffect(() => {
        setOpen(openDefaultDrawer);
    }, [openDefaultDrawer])
    const toggleDrawer = () => {
        setOpen(!open);
    };
    return <>
        <DesktopHeaderMenu open={open} breadcrumbs={breadcrumbs} logout={onClick}
                           onDrawerClick={toggleDrawer} userName={userName}/>
        <DesktopDrawer permissions={permissions} onClick={onClick} list={list}
                       toggleDrawer={toggleDrawer} open={open}/>
    </>
}

export default DesktopMenu;
