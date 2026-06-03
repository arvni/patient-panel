import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
    Paper,
    Avatar,
    Grid,
    alpha
} from "@mui/material";
import {
    AccessTime,
    CalendarToday,
    Person,
    RemoveRedEye,
    VideoCall,
    LocalHospital,
    AttachMoney,
    MedicalServices
} from "@mui/icons-material";
import {router} from "@inertiajs/react";


const Index = ({reservations, request}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const startRow = (request?.page ?? 1 - 1) * (request?.pageSize ?? 10);

    const show = (id) => (e) => {
        e.preventDefault();
        router.visit(route("reservations.show", id));
    }

    const handlePageChange = (e, page) => reloadPage(page + 1, request?.pageSize ?? 10, request?.filters);
    const handlePageSizeChange = (e) => reloadPage(1, e.target.value, request?.filters);
    const reloadPage = (page, pageSize, filters) => router.visit(route("reservations.index"), {
        data: {page, pageSize, filters},
        only: ["reservations", "request"]
    })

    // Mobile Card View
    if (isMobile) {
        return (
            <Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    My Appointments
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {reservations.data.length === 0 ? (
                    <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                        <CalendarToday sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Appointments Yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            You haven't booked any appointments yet
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => router.visit(route('reservations.create'))}
                        >
                            Book Appointment
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={3}>
                        {reservations.data.map((reservation, index) => (
                            <Card
                                key={reservation.id}
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                {/* Status Banner */}
                                <Box
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        background: reservation.verified
                                            ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                                            : `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="bold">
                                        {reservation.verified ? '✓ Confirmed' : '⏱ Pending Confirmation'}
                                    </Typography>
                                    <Typography variant="caption">
                                        #{startRow + index + 1}
                                    </Typography>
                                </Box>

                                <CardContent sx={{ p: 2 }}>
                                    {/* Doctor Info */}
                                    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
                                        <Avatar
                                            src={reservation?.time?.doctor?.image}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                border: 3,
                                                borderColor: 'primary.main',
                                            }}
                                        >
                                            <Person />
                                        </Avatar>
                                        <Box flexGrow={1}>
                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                                {reservation?.time?.doctor?.title || 'Doctor'}
                                            </Typography>
                                            {reservation?.time?.doctor?.specialty && (
                                                <Chip
                                                    icon={<MedicalServices sx={{ fontSize: 16 }} />}
                                                    label={reservation.time.doctor.specialty}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ height: 24 }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Appointment Details Grid */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Stack spacing={0.5}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Date
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {reservation?.time?.started_at ?
                                                        new Date(reservation.time.started_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Stack spacing={0.5}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <AccessTime sx={{ fontSize: 16, color: 'primary.main' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Time
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {reservation?.time?.started_at ?
                                                        new Date(reservation.time.started_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Stack spacing={0.5}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    {reservation.type == 2 ? (
                                                        <VideoCall sx={{ fontSize: 16, color: 'info.main' }} />
                                                    ) : (
                                                        <LocalHospital sx={{ fontSize: 16, color: 'info.main' }} />
                                                    )}
                                                    <Typography variant="caption" color="text.secondary">
                                                        Type
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {reservation.type == 2 ? 'Online' : 'In Person'}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Stack spacing={0.5}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <AttachMoney sx={{ fontSize: 16, color: 'success.main' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Cost
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight={600} color="success.main">
                                                    OMR {Intl.NumberFormat().format(reservation?.time?.price || 0)}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>

                                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        fullWidth
                                        endIcon={<RemoveRedEye />}
                                        onClick={show(reservation.id)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Stack>
                )}

                {reservations.data.length > 0 && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <TablePagination
                            component="div"
                            count={reservations.total}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handlePageSizeChange}
                            page={reservations.current_page - 1}
                            rowsPerPage={reservations.per_page}
                            rowsPerPageOptions={[10, 20, 50]}
                        />
                    </Box>
                )}
            </Box>
        );
    }

    // Desktop Table View
    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    My Appointments
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<CalendarToday />}
                    onClick={() => router.visit(route('reservations.create'))}
                >
                    Book New Appointment
                </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {reservations.data.length === 0 ? (
                <Paper elevation={1} sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
                    <CalendarToday sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No Appointments Yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        You haven't booked any appointments yet. Start by booking your first appointment.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<CalendarToday />}
                        onClick={() => router.visit(route('reservations.create'))}
                    >
                        Book Your First Appointment
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Doctor</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Specialty</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.data.map((reservation, index) => (
                                <TableRow
                                    key={reservation.id}
                                    hover
                                    sx={{
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => router.visit(route("reservations.show", reservation.id))}
                                >
                                    <TableCell>
                                        <Typography fontWeight={600}>
                                            {startRow + index + 1}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <Avatar
                                                src={reservation?.time?.doctor?.image}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                <Person />
                                            </Avatar>
                                            <Typography fontWeight={600}>
                                                {reservation?.time?.doctor?.title || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {reservation?.time?.doctor?.specialty ? (
                                            <Chip
                                                icon={<MedicalServices sx={{ fontSize: 16 }} />}
                                                label={reservation.time.doctor.specialty}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                N/A
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {reservation?.time?.started_at ?
                                                        new Date(reservation.time.started_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    {reservation?.time?.started_at ?
                                                        new Date(reservation.time.started_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={reservation.type == 2 ? <VideoCall /> : <LocalHospital />}
                                            label={reservation.type == 2 ? 'Online' : 'In Person'}
                                            size="small"
                                            color={reservation.type == 2 ? 'info' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            OMR {Intl.NumberFormat().format(reservation?.time?.price || 0)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={reservation.verified ? 'Confirmed' : 'Pending'}
                                            size="small"
                                            color={reservation.verified ? 'success' : 'warning'}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => router.visit(route("reservations.show", reservation.id))}
                                            aria-label="View reservation details"
                                        >
                                            <RemoveRedEye />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    count={reservations.total}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handlePageSizeChange}
                                    page={reservations.current_page - 1}
                                    rowsPerPage={reservations.per_page}
                                    rowsPerPageOptions={[10, 20, 50, 100]}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

Index.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Reservations"}]} children={page}
                                      head={"Reservations"}/>
export default Index;
