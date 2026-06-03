import {useState} from "react";
import {useForm} from '@inertiajs/react';

import {
    Backdrop,
    Box,
    CircularProgress,
    MobileStepper,
    Paper,
    Step,
    StepLabel,
    Stepper,
    useMediaQuery,
    useTheme
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

    const steps = [
        'Visit Type',
        'Choose Doctor',
        'Select Day',
        'Pick Time',
        'Confirm'
    ];
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
    return (
        <Box sx={{ pb: { xs: 2, md: 0 } }}>
            {/* Compact Progress Indicator */}
            <Paper
                elevation={2}
                sx={{
                    mb: 2,
                    p: { xs: 1.5, md: 2 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                }}
            >
                {isMobile ? (
                    <MobileStepper
                        variant="progress"
                        steps={5}
                        position="static"
                        activeStep={data.step - 1}
                        sx={{
                            background: 'transparent',
                            p: 0,
                            '& .MuiMobileStepper-progress': {
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                            },
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'white',
                            }
                        }}
                    />
                ) : (
                    <Stepper
                        activeStep={data.step - 1}
                        alternativeLabel
                        sx={{
                            '& .MuiStepLabel-root .Mui-completed': {
                                color: 'success.light',
                            },
                            '& .MuiStepLabel-root .Mui-active': {
                                color: 'white',
                            },
                            '& .MuiStepLabel-label': {
                                color: 'rgba(255,255,255,0.7)',
                            },
                            '& .MuiStepLabel-label.Mui-active': {
                                color: 'white',
                                fontWeight: 600,
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}
            </Paper>

            {/* Step Content - No TransitionGroup wrapper */}
            <Box>
                <SectionLayout
                    show={data.step === 1}
                    title="Choose Visit Type"
                    component={<ReservationTypeSection
                        onSelect={handleTypeChanged}
                        selectedType={data.type}
                    />}
                />
                <SectionLayout
                    show={data.step === 2}
                    title="Select Your Doctor"
                    handleBack={handleBack}
                    component={<DoctorSection
                        onSelect={handleDoctorChange}
                        doctors={doctors}
                        selectedDoctor={data.doctor}
                    />}
                />
                <SectionLayout
                    show={data.step === 3}
                    title="Pick Available Day"
                    handleBack={handleBack}
                    component={<DateGroupButton
                        onSelect={handleDaySelected}
                        doctor={data.doctor}
                        valueAccessor="value"
                        loading={loading}
                        selected={data.day}
                        items={days}
                    />}
                />
                <SectionLayout
                    show={data.step === 4}
                    title="Choose Appointment Time"
                    handleBack={handleBack}
                    component={<TimeGroupButton
                        doctor={data.doctor}
                        valueAccessor="value"
                        times={times}
                        time={data.time}
                        onTimeChange={handleTimeChange}
                        loading={loading}
                    />}
                />
                <SectionLayout
                    show={data.step === 5}
                    title="Confirm Your Booking"
                    handleBack={handleBack}
                    component={<InformationSection
                        data={data}
                        errors={errors}
                        onSubmit={handleSubmit}
                        onChange={handleChange}
                        show={data.step === 5}
                    />}
                />
            </Box>

            <Backdrop open={processing || loading} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}

Create.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Reservations"},{title: "Book An Appointment"}]} children={page}
                                       head={"Book An Appointment"}/>
export default Create;
