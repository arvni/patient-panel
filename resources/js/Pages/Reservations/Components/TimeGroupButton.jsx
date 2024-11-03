import {Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import DoctorCard from "./DoctorCard.jsx";

const groupButtonStyle = {
    display: "flex !important",
    flexWrap:"wrap",
    width: "100%",
    maxWidth: "500px",
    justifyContent: "space-around",
};

const buttonStyle = {
    borderRadius: "30px !important",
    padding: 1.875,
    paddingX: 3.75,
    width: "calc(25% - 10px)",
    m:"5px",
    border: "1px solid !important",
    background: "#fff",
    "&.Mui-selected": {
        background: "#2dc2dd",
    },
    "&.Mui-disabled": {
        background: "#a0a0a0",
    }
};

const TimeGroupButton = ({doctor, onTimeChange, time, times = []}) => {
    return <Stack spacing={2} direction="column" justifyContent="space-evenly">
        <DoctorCard doctor={doctor} selected/>
        <ToggleButtonGroup
            value={time}
            exclusive
            sx={groupButtonStyle}
            onChange={onTimeChange}
            aria-label="day" >
            {times?.map(item => <ToggleButton key={item.id}
                                              selected={item.id == time?.id}
                                              sx={buttonStyle}
                                              disabled={item.disabled}
                                              value={item.id}
                                              aria-label={item.title}>
                <Typography color="#000"
                            fontWeight="900"
                            sx={{position: "absolute"}}>{item.title}</Typography>
            </ToggleButton>)}
        </ToggleButtonGroup>
    </Stack>

}
export default TimeGroupButton
