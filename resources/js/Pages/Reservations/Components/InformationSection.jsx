import {
    Box, Button, Card, CardContent, FormHelperText,
    Grid, InputAdornment,OutlinedInput, Typography
} from "@mui/material";

import SectionLayout from "./SectionLayout.jsx";

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

const doctorImageStyle = {
    borderRadius: "50%",
    width: "150px",
    height: "150px",
}

export const TimeCard = ({data:{doctor,day,time}}) => {
    return <Card elevation={0} sx={{justifyContent:"center",display:"flex", background:"transparent"}}>
        <CardContent sx={cardContentStyle}>
            {doctor?.image && <Box className="image-box"
                                   sx={{
                                       padding: 2,
                                       width: "max-content",
                                       height: "max-content",
                                       borderRadius: "100%",
                                       background: "#1a96c7",
                                       zIndex: 100,
                                       boxShadow: "0px 0px 4px rgba(0,0,0,0.5)"
                                   }}>
                <img src={doctor?.image} style={doctorImageStyle} alt={doctor?.title}/></Box>}
            <Grid container className="card-title" sx={{
                padding:0,
                zIndex: 99,
                marginLeft: -8,
            }}
                   spacing={1}>
                <Grid item xs={12}
                      sx={{
                          background:"linear-gradient(90deg,#1a96c7,#0361ac)",
                          borderTopRightRadius: "2rem",
                          paddingY: 2,
                          paddingLeft: "80px !important",
                          paddingRight:4,
                      }}>
                <Typography textAlign="center"
                            fontWeight="bold"
                            color="white">{doctor?.title}</Typography>
                </Grid>
                <Grid item xs={12}
                      sx={{
                          borderBottomRightRadius: "2rem",
                          paddingLeft: "80px !important",
                          paddingRight:4,
                          paddingY:1,
                          background:"#f0f0f0",
                      }}>
                    <Typography textAlign="center" fontWeight="900">{day}</Typography>
                    <Typography textAlign="center" >{time.title}</Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>;
}

const InformationSection = ({data, onChange, onSubmit, errors}) => {

    return <Box component="form"
                onSubmit={onSubmit}
                sx={{
                    maxWidth: "500px",
                    padding: "20px",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TimeCard data={data}/>
            </Grid>
        </Grid>
        <Button type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
        >
            Sign Up
        </Button>
    </Box>
}

export default InformationSection;
