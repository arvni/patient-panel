import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Button,
    Collapse,
    Step,
    StepButton,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    useMediaQuery,
    useTheme,
    Card,
    CardContent,
    Stack,
    Box,
    Chip,
    Typography,
    Divider,
    IconButton,
    CardActions,
    LinearProgress,
    Alert,
} from "@mui/material";
import {useState} from "react";
import {router} from "@inertiajs/react";
import {Download, ExpandMore, CheckCircle, Schedule, Science, Assignment} from "@mui/icons-material";

// Mobile Card Component
const MobileTestCard = ({acceptanceItem, index}) => {
    const [expanded, setExpanded] = useState(true);
    const steps = [
        { label: "Registering", key: 1, icon: <Assignment /> },
        { label: "Sampling", key: 2, icon: <Science /> },
        { label: "Processing", key: 3, icon: <Schedule /> },
        { label: "Reported", key: 4, icon: <CheckCircle /> }
    ];

    const completedSteps = Object.keys(acceptanceItem.timeline).length;
    const progress = (completedSteps / steps.length) * 100;

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'reported') return 'success';
        if (statusLower === 'processing') return 'warning';
        if (statusLower === 'sampling') return 'info';
        return 'default';
    };

    const handleDownload = () => router.visit(route("acceptanceItems.show", {
        acceptanceItem: acceptanceItem.id,
        acceptance: acceptanceItem.acceptance_id
    }));

    return (
        <Card
            elevation={3}
            sx={{
                mb: 2,
                borderLeft: 4,
                borderColor: `${getStatusColor(acceptanceItem.status)}.main`,
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Test #{index + 1}
                            </Typography>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                {acceptanceItem.test}
                            </Typography>
                        </Box>
                        <Chip
                            label={acceptanceItem.status || 'Pending'}
                            color={getStatusColor(acceptanceItem.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    <Divider />

                    {/* Progress Bar */}
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                                Progress
                            </Typography>
                            <Typography variant="body2" fontWeight="600" color="primary">
                                {completedSteps}/{steps.length} Steps
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                }
                            }}
                        />
                    </Box>

                    {/* Expandable Timeline */}
                    <Box>
                        <Button
                            fullWidth
                            onClick={() => setExpanded(!expanded)}
                            endIcon={<ExpandMore sx={{
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                            }} />}
                            sx={{ justifyContent: 'space-between' }}
                        >
                            <Typography variant="body2" fontWeight="600">
                                View Timeline
                            </Typography>
                        </Button>

                        <Collapse in={expanded}>
                            <Box sx={{ mt: 2 }}>
                                {steps.map((step, idx) => {
                                    const isCompleted = acceptanceItem.timeline.hasOwnProperty(step.key);
                                    const timestamp = acceptanceItem.timeline[step.key];

                                    return (
                                        <Box
                                            key={step.key}
                                            display="flex"
                                            alignItems="flex-start"
                                            gap={2}
                                            mb={idx === steps.length - 1 ? 0 : 2}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: isCompleted ? 'success.light' : 'grey.200',
                                                    color: isCompleted ? 'success.dark' : 'grey.500',
                                                }}
                                            >
                                                {step.icon}
                                            </Box>
                                            <Box flex={1}>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={isCompleted ? 600 : 400}
                                                    color={isCompleted ? 'text.primary' : 'text.secondary'}
                                                >
                                                    {step.label}
                                                </Typography>
                                                {timestamp && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {timestamp}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Collapse>
                    </Box>
                </Stack>
            </CardContent>

            {acceptanceItem.status === "reported" && (
                <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Download />}
                        onClick={handleDownload}
                        size="large"
                    >
                        Download Report
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

// Desktop Table Row Component
const Row = ({acceptanceItem}) => {
    const [open, setOpen] = useState(true);
    const steps = [
        { label: "Registering", key: 1 },
        { label: "Sampling", key: 2 },
        { label: "Processing", key: 3 },
        { label: "Reported", key: 4 }
    ];

    const activeKey = [1, 2, 3, 4].filter(value => !Object.keys(acceptanceItem.timeline).includes(value + ""))[0];

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'reported') return 'success';
        if (statusLower === 'processing') return 'warning';
        if (statusLower === 'sampling') return 'info';
        return 'default';
    };

    const handleDownload = () => router.visit(route("acceptanceItems.show", {
        acceptanceItem: acceptanceItem.id,
        acceptance: acceptanceItem.acceptance_id
    }));

    const handleCollapse = () => setOpen(prevState => !prevState);

    return <>
        <TableRow key={"row-1-" + acceptanceItem.id} hover>
            <TableCell>
                <Button
                    onClick={handleCollapse}
                    sx={{ textAlign: 'left', justifyContent: 'flex-start', textTransform: 'none' }}
                    endIcon={<ExpandMore sx={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                    }} />}
                >
                    {acceptanceItem.test}
                </Button>
            </TableCell>
            <TableCell>
                <Chip
                    label={acceptanceItem.status || 'Pending'}
                    color={getStatusColor(acceptanceItem.status)}
                    size="small"
                />
            </TableCell>
            <TableCell>
                <Button
                    onClick={handleDownload}
                    disabled={acceptanceItem.status !== "reported"}
                    variant="contained"
                    size="small"
                    startIcon={<Download />}
                >
                    View Report
                </Button>
            </TableCell>
        </TableRow>
        <TableRow key={"row-2-" + acceptanceItem.id}>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={3}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ py: 2 }}>
                        <Stepper nonLinear alternativeLabel activeStep={activeKey - 1}>
                            {steps.map((step) => (
                                <Step key={step.key} completed={acceptanceItem.timeline.hasOwnProperty(step.key)}>
                                    <StepButton color="inherit">
                                        {step.label}
                                        <br/>
                                        <Typography variant="caption" color="text.secondary">
                                            {acceptanceItem.timeline[step?.key]}
                                        </Typography>
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

const Show = ({acceptance}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box>
                {/* Header Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="700" gutterBottom>
                        Test Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Registered on {new Date(acceptance.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Typography>
                </Box>

                {/* Info Alert */}
                {acceptance.acceptance_items.some(item => item.status === 'reported') && (
                    <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                        Some test results are ready for download!
                    </Alert>
                )}

                {/* Test Cards */}
                <Stack spacing={0}>
                    {acceptance.acceptance_items.map((item, index) => (
                        <MobileTestCard
                            key={item.id}
                            acceptanceItem={item}
                            index={index}
                        />
                    ))}
                </Stack>

                {/* Empty State */}
                {acceptance.acceptance_items.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Science sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Tests Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            There are no test items in this acceptance
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    }

    // Desktop View
    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                    Test Details
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Registered on {new Date(acceptance.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Typography>
            </Box>

            {/* Info Alert */}
            {acceptance.acceptance_items.some(item => item.status === 'reported') && (
                <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                    Some test results are ready for download!
                </Alert>
            )}

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Test Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {acceptance.acceptance_items.map(item => (
                            <Row key={item.id} acceptanceItem={item}/>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Empty State */}
            {acceptance.acceptance_items.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Science sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No Tests Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        There are no test items in this acceptance
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
Show.layout = page => <Authenticated head={"Test " + new Date(page.props.acceptance.created_at).toDateString()}
                                     auth={page.props.auth}
                                     children={page}
                                     breadcrumbs={[
                                         {
                                             title: "Tests",
                                             link: route("acceptances.index")
                                         },
                                         {
                                             title: "Test " + new Date(page.props.acceptance.created_at).toDateString(),
                                         },
                                     ]}
/>
export default Show;
