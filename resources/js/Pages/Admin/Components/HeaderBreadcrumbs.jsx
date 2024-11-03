import {Typography} from "@mui/material";
import React from "react";

const HeaderBreadcrumbs=({title})=>{
    return <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        {title}
    </Typography>
}
export default HeaderBreadcrumbs;
