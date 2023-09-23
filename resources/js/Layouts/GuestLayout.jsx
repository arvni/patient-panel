import {Container} from "@mui/material";
import {Head} from "@inertiajs/react";

export default function Guest({children, head}) {
    return (<>
            {head && <Head title={head}/>}
            <Container sx={{display: "flex", minHeight: "100vh", alignContent: "center", justifyContent: "center",alignItems:"center"}}>
                {children}
            </Container>
        </>
    );
}
