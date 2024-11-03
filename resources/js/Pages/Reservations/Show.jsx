import React from "react";
import {Alert, Button, ListItemAvatar, ListItem, ListItemText, Box, List} from "@mui/material";

import Typography from '@mui/material/Typography';
import {CreditCard, Person, PhoneAndroid} from "@mui/icons-material";
import SectionLayout from "./Components/SectionLayout.jsx";
import {router} from "@inertiajs/react";
import {TimeCard} from "./Components/InformationSection.jsx";
import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";

const Show = ({paymentMessage, reservation, timeCardData}) => {
    const handleExit = () => {
        router.visit(route("reservations.index"));
        window.parent.postMessage("closeSuccess", "*");
    }
    const handleBack = () => {
        router.visit(route('reservations.index'));
    }
    const handlePayment = () => router.post(route("reservations.payment", reservation.id));
    return <SectionLayout show
                          title={<Typography>
                              <strong>Dear {reservation?.customer?.name}</strong>
                              <span> we look forward to welcoming you for your scheduled appointment</span>
                          </Typography>}
                          handleBack={handleBack}
                          component={<>
                              <Box sx={{
                                  mt: 1,
                                  mx: 2,
                                  px: 4,
                                  borderRadius: 4,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignContent: "center",
                                  justifyContent: "center"
                              }}>
                                  <TimeCard data={timeCardData}/>
                                  <List dense sx={{mt: 2}}>
                                      <ListItem sx={{
                                          background: "#f0f0f0",
                                          padding: "5px",
                                          borderRadius: "10px",
                                          mt: "10px"
                                      }}>
                                          <ListItemAvatar sx={{
                                              width: "80px",
                                              height: "30px",
                                              alignItems: "center",
                                              background: "white",
                                              display: "flex",
                                              justifyContent: "center",
                                              borderRadius: "10px",
                                              boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)"
                                          }}>
                                              <PhoneAndroid sx={{fontSize: 30}}/>
                                          </ListItemAvatar>
                                          <ListItemText>
                                              <Typography textAlign="center"
                                                          fontSize="18px">{reservation?.customer?.mobile}</Typography>
                                          </ListItemText>
                                      </ListItem>
                                      <ListItem sx={{
                                          background: "#f0f0f0",
                                          padding: "5px",
                                          borderRadius: "10px",
                                          mt: "10px"
                                      }}>
                                          <ListItemAvatar sx={{
                                              width: "80px",
                                              height: "30px",
                                              alignItems: "center",
                                              background: "white",
                                              display: "flex",
                                              justifyContent: "center",
                                              borderRadius: "10px",
                                              boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)"
                                          }}>
                                              <Typography fontSize="30">Type</Typography>
                                          </ListItemAvatar>
                                          <ListItemText>
                                              <Typography textAlign="center"
                                                          fontSize="18px">{reservation.type == 2 ? "Online" : "In Person"}</Typography>
                                          </ListItemText>
                                      </ListItem>
                                      <ListItem sx={{
                                          background: "#f0f0f0",
                                          padding: "5px",
                                          borderRadius: "10px",
                                          mt: "10px"
                                      }}>
                                          <ListItemAvatar sx={{
                                              width: "80px",
                                              height: "30px",
                                              alignItems: "center",
                                              background: "white",
                                              display: "flex",
                                              justifyContent: "center",
                                              borderRadius: "10px",
                                              boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)"
                                          }}>
                                              <Typography fontSize="30">Cost</Typography>
                                          </ListItemAvatar>
                                          <ListItemText>
                                              <Typography textAlign="center"
                                                          fontSize="18px">OMR {Intl.NumberFormat().format(reservation.time.price)}</Typography>
                                          </ListItemText>
                                      </ListItem>
                                      <ListItem sx={{mt: 3, p: 0}}>
                                          <ListItemAvatar sx={{
                                              width: "80px",
                                              alignItems: "center",
                                              display: "flex",
                                              height: "48px",
                                              justifyContent: "center",
                                          }}>
                                              <CreditCard sx={{fontSize: "40px"}}/>
                                          </ListItemAvatar>
                                          <ListItemText>
                                              {reservation?.transaction ?
                                                  <Alert severity="info">{paymentMessage}</Alert> :
                                                  <Button variant="contained" onClick={handlePayment}>Pay</Button>}
                                          </ListItemText>
                                      </ListItem>
                                  </List>
                              </Box>
                          </>}/>;
}
Show.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Reservations"},{}]} children={page}
                                       head={"Reservation"}/>
export default Show;
