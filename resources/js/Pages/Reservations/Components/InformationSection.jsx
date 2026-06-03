import {
    Box, Button, Card, CardContent, FormHelperText,
    Grid, InputAdornment, OutlinedInput, Typography, Alert, Stack
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

export const TimeCard = ({data = {}}) => {
    const { doctor = {}, day, time = {} } = data;

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
                          paddingLeft: { xs: "60px !important", sm: "80px !important" },
                          paddingRight: { xs: 2, sm: 4 },
                      }}>
                <Typography textAlign="center"
                            fontWeight="bold"
                            color="white">{doctor?.title}</Typography>
                </Grid>
                <Grid item xs={12}
                      sx={{
                          borderBottomRightRadius: "2rem",
                          paddingLeft: { xs: "60px !important", sm: "80px !important" },
                          paddingRight: { xs: 2, sm: 4 },
                          paddingY:1,
                          background:"#f0f0f0",
                      }}>
                    <Typography textAlign="center" fontWeight="900">{day}</Typography>
                    <Typography textAlign="center" >{time?.title}</Typography>
                </Grid>
            </Grid>
        </CardContent>
    </Card>;
}

const InformationSection = ({data, onChange, onSubmit, errors}) => {
    const hasErrors = errors && Object.keys(errors).length > 0;

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
        <Stack spacing={2} sx={{ width: "100%" }}>
            {/* Error Display */}
            {hasErrors && (
                <Alert severity="error" sx={{ width: "100%" }}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            Please correct the following errors:
                        </Typography>
                        {Object.entries(errors).map(([field, messages]) => (
                            <Typography key={field} variant="body2">
                                • {Array.isArray(messages) ? messages[0] : messages}
                            </Typography>
                        ))}
                    </Stack>
                </Alert>
            )}

            {/* Booking Summary */}
            <TimeCard data={data}/>

            {/* Confirm Button */}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                }}
            >
                Confirm Booking
            </Button>
        </Stack>
    </Box>
}

export default InformationSection;
