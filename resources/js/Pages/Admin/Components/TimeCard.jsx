import {
    Avatar,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {
    Email,
    MobileFriendly,
    PaymentOutlined,
    Person,
    PhoneIphone
} from "@mui/icons-material";
import React from "react";
import {router} from "@inertiajs/react";

const TimeCard = ({time}) => {
    const handlePayment = () => time?.reservation ? router.post(
        route("reservations.payment", time?.reservation)
    ) : null
    return <List>
        <ListItem>
            <ListItemAvatar>
                <Avatar src={time?.doctor?.image}/>
            </ListItemAvatar>
            <ListItemText primary={time?.doctor?.title}
                          secondary={new Date(time.started_at).toDateString() + " at " + time?.title + (time.is_online ? " Online" : "")}/>
        </ListItem>
        {time?.reservation && <>

            <ListItem>
                <ListItemIcon>
                    <PhoneIphone/>
                </ListItemIcon>
                <ListItemText>{time?.reservation?.customer?.mobile}</ListItemText>
            </ListItem>

            {time?.reservation?.customer?.email && <ListItem>
                <ListItemIcon><Email/></ListItemIcon>
                <ListItemText>{time?.reservation?.customer?.email}</ListItemText>
            </ListItem>}
            <ListItem>
                <ListItemIcon>Type</ListItemIcon>
                <ListItemText>{time.reservation.type == 1 ? "In Person" : "Online"}</ListItemText>
            </ListItem>
            <ListItem>
                <ListItemIcon>Cost</ListItemIcon>
                <ListItemText>OMR {Intl.NumberFormat().format(time.price)}</ListItemText>
            </ListItem>
                <ListItem>
                <ListItemIcon>
                <PaymentOutlined/>
                </ListItemIcon>
                <ListItemText>
            {time?.reservation?.transaction?.created_at ||
                <Button variant="contained" onClick={handlePayment}>Pay</Button>}
    </ListItemText>
            </ListItem>
        </>}
    </List>

}

export default TimeCard;
