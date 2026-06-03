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
    paddingY: { xs: 2, sm: 4 },
    paddingX: { xs: 3, sm: 7.5 },
    border: "1px solid",
    borderLeft: "1px solid !important",
    minHeight: 44, // Mobile-friendly touch target
    minWidth: { xs: "120px", sm: "150px" },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
                <Stack spacing={0.5} alignItems="center">
                    <Typography
                        variant="body2"
                        sx={{
                            color: selected == item ? "white" : "#000",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {item.split(",")[0]}
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                            color: selected == item ? "white" : "#000",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            textAlign: "center",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {item.split(", ")[1]}
                    </Typography>
                </Stack>
            </ToggleButton>)}
        </ToggleButtonGroup>
    </Stack>

}
export default DateGroupButton
