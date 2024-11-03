import {
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
} from "@mui/material";
import {useState} from "react";
import {Add} from "@mui/icons-material";

import AddTimeSlotForm from "./AddTimeSlotForm.jsx";


const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
const hours = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
];
const defaultTimeSlot = {
    id: Date.now(),
    day: null,
    started_at: "",
    ended_at: ""
};
const WeeklySchedule = ({data, onChange, onDeleteTimeSlot}) => {
    const [timeSlot, setTimeSlot] = useState(defaultTimeSlot);
    const [openAdd, setOpenAdd] = useState(false)
    const handleAddNewTimeSlot = (index) => () => {
        setTimeSlot(prevState => ({...defaultTimeSlot, id: Date.now(), day: index}))
        setOpenAdd(true)
    }
    const handleChange = () => {
        onChange(timeSlot);
        handleCloseAdd();
    }
    const handleCloseAdd = () => {
        setTimeSlot(defaultTimeSlot);
        setOpenAdd(false);
    }
    const handleEdit = (id, index) => () => {
        setTimeSlot({...data[index].find(item => item.id === id), day: index});
        setOpenAdd(true);
    }
    const handleDelete = () => {
        onDeleteTimeSlot(timeSlot, handleCloseAdd)
    }
    return <>
        <List sx={{minWidth: "450px"}}>
            {weekDays.map((item, index) => <>
                <ListItem key={"day-" + index} components="div" sx={{minHeight: "50px"}}>
                    <ListItemAvatar>
                        {item}
                    </ListItemAvatar>
                    <ListItemText>
                        <Stack direction="row" spacing={1} mx={5}>
                            {data[index].map(item => <Button onClick={handleEdit(item.id, index)}
                                                             color={item.only_online ? "secondary" : "primary"}
                                                             variant="contained"
                                                             key={item.id}
                            >{item.started_at + "-" + item.ended_at}</Button>)}
                        </Stack>
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <IconButton onClick={handleAddNewTimeSlot(index)}><Add/></IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider component="li"/>
            </>)}
        </List>
        <AddTimeSlotForm open={openAdd}
                         data={timeSlot}
                         setData={setTimeSlot}
                         onsubmit={handleChange}
                         title={weekDays[timeSlot.day]}
                         onClose={handleCloseAdd}
                         onDelete={handleDelete}/>
    </>;
}

export default WeeklySchedule;
