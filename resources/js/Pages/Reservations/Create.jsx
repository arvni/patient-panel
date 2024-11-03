import {useState} from "react";
import {useForm} from '@inertiajs/react';

import {
    Backdrop,
    CircularProgress,
} from "@mui/material";
import {TransitionGroup} from "react-transition-group";
import Authenticated from "@/Layouts/AuthenticatedLayout";

import DoctorSection from "./Components/DoctorSection.jsx";
import InformationSection from "./Components/InformationSection.jsx";
import SectionLayout from "./Components/SectionLayout.jsx";
import DateGroupButton from "./Components/DateGroupButton.jsx";
import ReservationTypeSection from "./Components/ReservationTypeSection.jsx";
import TimeGroupButton from "./Components/TimeGroupButton.jsx";

function Create({doctors = []}) {
    const [days, setDays] = useState([]);
    const [times, setTimes] = useState([])
    const [loading, setLoading] = useState(false)
    const {data, setData, post, processing, errors, setError, clearErrors} = useForm({
        step: 1,
        doctor: null,
        email: "",
        type: null,
        time: null,
        day: null
    });
    const handleSubmit = e => {
        e.preventDefault();
        clearErrors();
        post(route("reservations.store"), {
            onSuccess: () => {
                setData(previousData => ({...previousData, step: previousData.step + 1}))
            }
        });
    }
    const handleChange = (e) => {
        setData(previousData => ({...previousData, [e.target.name]: e.target.value}));
    }
    const handleDaySelected = (_, value) => {
        let date = value || data?.day;
        setTimes([]);
        if (date) {
            setData(previousData => ({...previousData, day: date, step: 4}));
            setTimes(days?.[date])
        }
    }
    const handleDoctorChange = (_, value) => {
        let doctor = value || data.doctor;
        if (doctor) {
            setData(previousData => ({...previousData, doctor}));
            setLoading(true);
            axios.get(route("doctors.days", {doctor: doctor.id, type: data.type}),).then(res => {
                setDays(res.data.days);
                setTimes([]);
                setData(previousData => ({...previousData, item: null, day: null, step: 3}));
                setLoading(false);
            });
        }
    }
    const handleTypeChanged = (_, value) => {
        let type = value || data.type;
        if (type) {
            setData(previousData => ({...previousData, type, step: 2}));
        }
    }
    const handleTimeChange = (_, value) => {
        let time = value || data?.time?.id;
        if (time)
            setData(previousData => ({
                ...previousData,
                time: times.find(item => item.id === time),
                step: 5
            }))
    }
    const handleBack = (e) => {
        e.preventDefault();
        setData(previousData => ({...previousData, step: previousData.step - 1}));
    }
    return (<>
            <TransitionGroup>
                <SectionLayout show={data.step === 1}
                               title="Please choose a Visit Type"
                               component={<ReservationTypeSection
                                   onSelect={handleTypeChanged}
                                   selectedType={data.type}/>}
                />
                <SectionLayout show={data.step === 2}
                               title="Please choose a Doctor"
                               handleBack={handleBack}
                               component={<DoctorSection
                                   onSelect={handleDoctorChange}
                                   doctors={doctors}
                                   selectedDoctor={data.doctor}/>}
                />
                <SectionLayout show={data.step === 3}
                               title="Please choose a Day"
                               handleBack={handleBack}
                               component={<DateGroupButton onSelect={handleDaySelected}
                                                           doctor={data.doctor}
                                                           valueAccessor="value"
                                                           loading={loading}
                                                           selected={data.day}
                                                           items={days}/>}
                />
                <SectionLayout show={data.step === 4}
                               title="Please choose a Time"
                               handleBack={handleBack}
                               component={<TimeGroupButton doctor={data.doctor}
                                                           valueAccessor="value"
                                                           times={times}
                                                           time={data.time}
                                                           onTimeChange={handleTimeChange}
                                                           loading={loading}/>}
                />
                <SectionLayout show={data.step === 5}
                               title="Fill The Form"
                               handleBack={handleBack}
                               component={<InformationSection
                                   data={data}
                                   errors={errors}
                                   onSubmit={handleSubmit}
                                   onChange={handleChange}
                                   show={data.step === 5}/>}
                />
            </TransitionGroup>
            <Backdrop open={processing || loading}>
                <CircularProgress/>
            </Backdrop>
        </>
    );
}

Create.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Reservations"},{title: "Book An Appointment"}]} children={page}
                                       head={"Book An Appointment"}/>
export default Create;
