import {Container, Grid, Typography} from "@mui/material";
import {Head} from "@inertiajs/react";
import logo from "../../images/logo.png";

export default function Guest({children, head}) {
    return (<>
            {head && <Head title={head}/>}
            <Container sx={{
                display: "flex",
                minHeight: "100vh",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                flexDirection:"column",
                gap:5
            }} maxWidth={"xs"}>
                <img src={logo} style={{maxWidth: "200px", marginLeft: "auto", marginRight: "auto"}}/>
                <Typography variant={"h4"}>Patient Panel</Typography>
                {children}
            </Container>
        </>
    );
}
