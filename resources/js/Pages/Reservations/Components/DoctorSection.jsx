import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import DoctorCard from "./DoctorCard.jsx";

const doctorButtonStyle = {
    borderTopRightRadius: "1.5em",
    borderBottomRightRadius: "1.5em",
    borderBottomLeftRadius: "max(115px,25dvw)",
    borderTopLeftRadius: "max(115px,25dvw)",
    border: "none",
    padding:0,
    borderCollapse: "collapse",
    "&:hover": {
        background: "transparent",
        "& .card-title":{
            background:"#2dc2dd"
        },
        "& .image-box":{
            background:"#2dc2dd"
        },
        "& img": {
            transform: "scale(1.01)"
        }
    },
    "&.Mui-selected": {
        background: "transparent",
        "&:hover": {
            background: "transparent",
        },

        "& .card-title":{
            background:"#2dc2dd"
        },
        "& .image-box":{
            background:"#2dc2dd"
        },
    }
}
const doctorButtonGroupStyle = {
    display: "flex",
    flexDirection:"column",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignContent: "space-between",
    alignItems: "stretch",
    gap: "2em",
}

const DoctorSection = ({selectedDoctor, doctors, onSelect}) => {
    return <ToggleButtonGroup
        value={selectedDoctor}
        exclusive
        sx={doctorButtonGroupStyle}
        onChange={onSelect}
        aria-label="doctor"
    >
        {doctors.map(doctor => <ToggleButton key={"dr-" + doctor.id}
                                             sx={doctorButtonStyle}
                                             value={doctor}
                                             aria-label={doctor.title}>
                <DoctorCard doctor={doctor}/>
            </ToggleButton>
        )}
    </ToggleButtonGroup>;
}

export default DoctorSection;
