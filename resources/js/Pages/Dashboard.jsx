import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import {
    AddCircleOutline,
    Biotech,
    EventNote,
    ArrowForward,
    ExitToApp
} from '@mui/icons-material';

function Dashboard({auth}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleNavigate = (routeName) => {
        router.visit(route(routeName));
    };

    const menuItems = [
        {
            title: 'My Appointments',
            description: 'View and manage your scheduled appointments',
            icon: <EventNote sx={{ fontSize: { xs: 32, md: 40 } }} />,
            route: 'reservations.index',
            color: theme.palette.success.main,
            gradient: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
        },
        {
            title: 'Book Appointment',
            description: 'Schedule a new appointment with your doctor',
            icon: <AddCircleOutline sx={{ fontSize: { xs: 32, md: 40 } }} />,
            route: 'reservations.create',
            color: theme.palette.primary.main,
            gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
        },
        {
            title: 'Lab Results',
            description: 'Access your test results and medical reports',
            icon: <Biotech sx={{ fontSize: { xs: 32, md: 40 } }} />,
            route: 'acceptances.index',
            color: theme.palette.info.main,
            gradient: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`
        },
        {
            title: 'Logout',
            description: 'Securely sign out of your account',
            icon: <ExitToApp sx={{ fontSize: { xs: 32, md: 40 } }} />,
            route: 'logout',
            color: theme.palette.error.main,
            gradient: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`
        }
    ];

    return (
        <Box sx={{ py: { xs: 1, md: 2 } }}>
            {/* Welcome Section */}
            <Paper
                elevation={0}
                sx={{
                    mb: { xs: 1.5, md: 3 },
                    p: { xs: 2, md: 3 },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white',
                    borderRadius: 2,
                }}
            >
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                    Welcome, {auth.user.name}!
                </Typography>
            </Paper>

            {/* Main Menu Navigation - 2x2 Grid on Mobile */}
            <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
                {menuItems.map((item, index) => (
                    <Grid item xs={6} sm={6} md={6} key={index}>
                        <Box
                            onClick={() => handleNavigate(item.route)}
                            sx={{
                                position: 'relative',
                                minHeight: { xs: 140, md: 200 },
                                borderRadius: 2,
                                backgroundColor: 'white',
                                border: `1px solid ${alpha(item.color, 0.2)}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                transition: 'all 0.2s ease-in-out',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: { xs: 1.5, md: 2.5 },
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 8px 16px ${alpha(item.color, 0.25)}`,
                                    borderColor: item.color,
                                },
                                '&:active': {
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            {/* Gradient Bar */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    borderRadius: '8px 8px 0 0',
                                    background: item.gradient,
                                }}
                            />

                            {/* Icon */}
                            <Box
                                sx={{
                                    width: { xs: 50, md: 60 },
                                    height: { xs: 50, md: 60 },
                                    borderRadius: '50%',
                                    bgcolor: alpha(item.color, 0.15),
                                    color: item.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: { xs: 1, md: 1.5 }
                                }}
                            >
                                {item.icon}
                            </Box>

                            {/* Title */}
                            <Typography
                                variant={isMobile ? "subtitle2" : "h6"}
                                fontWeight="bold"
                                sx={{
                                    color: item.color,
                                    lineHeight: 1.2,
                                    fontSize: { xs: '0.875rem', md: '1.125rem' },
                                    mb: { xs: 0.5, md: 1 }
                                }}
                            >
                                {item.title}
                            </Typography>

                            {/* Description - Hidden on very small screens */}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.3,
                                    display: { xs: 'none', sm: 'block', md: 'block' },
                                    fontSize: { sm: '0.7rem', md: '0.75rem' },
                                    mb: { sm: 1.5, md: 2 }
                                }}
                            >
                                {item.description}
                            </Typography>

                            {/* Arrow Icon */}
                            <Box
                                sx={{
                                    mt: 'auto',
                                    width: { xs: 28, md: 36 },
                                    height: { xs: 28, md: 36 },
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: { xs: '0.875rem', md: '1rem' }
                                }}
                            >
                                <ArrowForward sx={{ fontSize: { xs: 16, md: 20 } }} />
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

Dashboard.layout = page => <AuthenticatedLayout children={page} breadcrumbs={[]} auth={page.props.auth}
                                                head="Dashboard"/>

export default Dashboard
