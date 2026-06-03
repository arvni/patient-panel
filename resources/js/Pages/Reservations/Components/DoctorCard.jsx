import {Box, Card, CardContent, Stack, Typography} from "@mui/material";


const cardContentStyle = {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    p: "0",
    color: "#000",
    "&:last-child": {
        paddingBottom: 0
    }
}

const DoctorCard = ({doctor, selected = false}) => {
    return <Card elevation={0} sx={{justifyContent: "center", display: "flex",background:"transparent"}}>
        <CardContent sx={cardContentStyle}>
            {doctor?.image && <Box className="image-box"
                                   sx={{
                                       padding: 2,
                                       width: "max-content",
                                       height: "max-content",
                                       borderRadius: "100%",
                                       background: selected ? "#2dc2dd" : "#c5c5c5",
                                       zIndex: 100,
                                       boxShadow: "0px 0px 4px rgba(0,0,0,0.5)"
                                   }}>
                <Box
                    component="img"
                    src={doctor?.image}
                    alt={doctor?.title}
                    sx={{
                        borderRadius: "50%",
                        width: { xs: "100px", sm: "150px" },
                        height: { xs: "100px", sm: "150px" },
                    }}
                /></Box>}
            <Stack className="card-title" sx={{
                paddingY: 2,
                paddingLeft: 10,
                paddingRight: 4,
                marginLeft: -6,
                background: selected ? "#2dc2dd" : "#b5b5b5",
                zIndex: 99,
                borderTopRightRadius: "2rem",
                borderBottomRightRadius: "2rem",
                '@media (max-width:600px)': {
                    paddingLeft: 7,
                    paddingRight: 2,
                    marginLeft: -4,
                },
            }}
                   spacing={1}>
                <Typography fontWeight={"bold"}>{doctor?.title}</Typography>
                <Typography>{doctor?.subtitle}</Typography>
                <Typography fontWeight={"bold"}>{doctor?.specialty}</Typography>
            </Stack>
        </CardContent>
    </Card>;
}

export default DoctorCard;
