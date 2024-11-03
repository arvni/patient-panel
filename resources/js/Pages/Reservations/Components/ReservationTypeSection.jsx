import {Avatar, Box, Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";


const NewToggleButton = ({title, value, selected, icon, disabled, ...rest}) => {
    return <ToggleButton {...rest}
                         value={value}
                         selected={selected}
                         aria-label={title}
                         disabled={disabled}
                         sx={{
                             border: "none",
                             "&:hover": {
                                 background: "inherit",
                                 " .box": {
                                     background: "#2dc2dd",
                                 }
                             },
                             " .box": {
                                 background: "#a0a0a0",
                             },
                             "&.Mui-selected":{
                                 background: "inherit",
                                 " .box": {
                                     background: "#2dc2dd",
                                 }
                             }
                         }}>

        <Stack spacing={1} alignItems="center">
            {icon && <Box variant="circular"
                          sx={{
                              borderRadius:"75px",
                              width: 150,
                              height: 150,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                          }}
                          className="box">
                <img src={icon} width="100px" height="100px"/>
            </Box>}
            <Typography variant="h6">
                {title}
            </Typography>
        </Stack>
    </ToggleButton>

}

const ReservationTypeSection = ({selectedType = "", onSelect}) => {
    const types = [
        {
            value: 2,
            title: "Online",
            icon: "/images/online.png",
            disabled: false
        },
        {
            value: 1,
            title: "In Person",
            icon: "/images/in-person.png",
            disabled: false
        },
    ]
    return <ToggleButtonGroup
        value={selectedType}
        exclusive
        onChange={onSelect}
        sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
        }}
        aria-label="Reservation Type">
        {types.map(type => <NewToggleButton
            title={type.title}
            value={type.value}
            icon={type?.icon}
            disabled={type.disabled}
            selected={selectedType == type.value}
            key={"type-" + type.value}/>)}
    </ToggleButtonGroup>;
}

export default ReservationTypeSection;
