import {Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import DoctorCard from "./DoctorCard.jsx";

const groupButtonStyle = {
    display: "flex !important",
    flexWrap: "wrap",
    gap: 2,
    width: "100%",
    maxWidth: "500px",
    justifyContent: "space-around",
};

const buttonStyle = {
    borderRadius: "30px !important",
    paddingY: 4,
    paddingX: 7.5,
    border: "1px solid",
    borderLeft: "1px solid !important",
    "&.Mui-selected": {
        background: "#2dc2dd",
        color: "white",
    }
};

const DateGroupButton = ({
                             items,
                             doctor,
                             onSelect,
                             selected,
                         }) => {
    return <Stack spacing={2} direction="column" justifyContent="space-evenly">
        <DoctorCard doctor={doctor} selected/>
        <ToggleButtonGroup
            value={selected}
            exclusive
            sx={groupButtonStyle}
            onChange={onSelect}
            aria-label="day"
        >
            {Object.keys(items)?.map(item => <ToggleButton key={item}
                                                           selected={selected==item}
                                                           sx={buttonStyle}
                                                           value={item}
                                                           aria-label={item}>
                <Typography color="#000"
                            sx={{
                                position:"absolute"
                            }}>
                    {item.split(",")[0]}<br/><strong>{item.split(", ")[1]}</strong>
                </Typography>
            </ToggleButton>)}
        </ToggleButtonGroup>
    </Stack>

}
export default DateGroupButton
