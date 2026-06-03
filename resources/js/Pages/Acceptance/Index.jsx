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
    Paper
} from "@mui/material";
import {AccessTime, Add, Badge, Biotech, Person, RemoveRedEye, Update} from "@mui/icons-material";
import {router} from "@inertiajs/react";


const maskNationalId = (id) => {
    if (!id) return "";
    return id.length > 4 ? `••••${id.slice(-4)}` : id;
}

const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('complete') || statusLower.includes('ready')) return 'success';
    if (statusLower.includes('pending') || statusLower.includes('process')) return 'warning';
    if (statusLower.includes('cancelled') || statusLower.includes('rejected')) return 'error';
    return 'default';
}

const NationalIdPicker = ({nationalIds, selectedNationalId}) => {
    const pick = (national_id) => () => {
        if (national_id === selectedNationalId) return;
        router.post(route("acceptances.nationalId.select"), {national_id});
    }
    const addNew = () => router.visit(route("acceptances.nationalId.create"));

    return (
        <Box sx={{mb: 3}}>
            <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 600}}>
                Choose whose results to view
            </Typography>
            <Stack direction="row" spacing={2} sx={{flexWrap: "wrap", gap: 2}}>
                {nationalIds.map((item) => {
                    const selected = item.national_id === selectedNationalId;
                    return (
                        <Card
                            key={item.national_id}
                            elevation={selected ? 6 : 1}
                            onClick={pick(item.national_id)}
                            sx={{
                                cursor: "pointer",
                                minWidth: 200,
                                border: 2,
                                borderColor: selected ? "primary.main" : "transparent",
                            }}
                        >
                            <CardContent>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Person color={selected ? "primary" : "action"}/>
                                    <Box>
                                        <Typography variant="body1" fontWeight={600}>
                                            {item.name || "Unknown patient"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: {maskNationalId(item.national_id)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    );
                })}
                <Button
                    onClick={addNew}
                    variant="outlined"
                    startIcon={<Add/>}
                    sx={{minWidth: 200, minHeight: 80, borderStyle: "dashed"}}
                >
                    Add National ID
                </Button>
            </Stack>
            <Divider sx={{mt: 3}}/>
        </Box>
    );
}

const EmptyState = ({hasNationalIds}) => (
    <Box sx={{textAlign: 'center', py: 8}}>
        <Badge sx={{fontSize: 64, color: 'text.disabled', mb: 2}}/>
        <Typography variant="h6" color="text.secondary">
            {hasNationalIds ? "Select a patient above to view their lab results" : "No National ID added yet"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
            Add your National ID to look up and view lab results.
        </Typography>
        {!hasNationalIds && (
            <Button
                variant="contained"
                startIcon={<Add/>}
                onClick={() => router.visit(route("acceptances.nationalId.create"))}
            >
                Add National ID
            </Button>
        )}
    </Box>
);

const Index = ({acceptances, request, nationalIds = [], selectedNationalId = null}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const startRow = ((request?.page ?? 1) - 1) * (request?.pageSize ?? 10);

    const show = (id) => (e) => {
        e.preventDefault();
        router.visit(route("acceptances.show", id));
    }

    const handlePageChange = (e, page) => reloadPage(page + 1, request?.pageSize ?? 10, request?.filters);
    const handlePageSizeChange = (e) => reloadPage(1, e.target.value, request?.filters);
    const reloadPage = (page, pageSize, filters) => router.visit(route("acceptances.index"), {
        data: {page, pageSize, filters},
        only: ["acceptances", "request"]
    })

    const renderResults = () => {
        if (!selectedNationalId || !acceptances) {
            return <EmptyState hasNationalIds={nationalIds.length > 0}/>;
        }

        // Mobile Card View
        if (isMobile) {
            return (
                <Box>
                    <Stack spacing={2}>
                        {acceptances.data.map((acceptance, index) => (
                            <Card
                                key={acceptance.id}
                                elevation={2}
                                sx={{
                                    borderLeft: 4,
                                    borderColor: `${getStatusColor(acceptance.status)}.main`
                                }}
                            >
                                <CardContent>
                                    <Stack spacing={1.5}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Chip
                                                label={`Test #${startRow + index + 1}`}
                                                size="small"
                                                color="primary"
                                                icon={<Biotech/>}
                                            />
                                            <Chip
                                                label={acceptance.status || 'Pending'}
                                                size="small"
                                                color={getStatusColor(acceptance.status)}
                                            />
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AccessTime fontSize="small" color="action"/>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Registered
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {new Date(acceptance.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Update fontSize="small" color="action"/>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Last Updated
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {new Date(acceptance.updated_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </CardContent>
                                <CardActions sx={{justifyContent: 'flex-end', px: 2, pb: 2}}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        endIcon={<RemoveRedEye/>}
                                        onClick={show(acceptance.id)}
                                        fullWidth
                                    >
                                        View Test Details
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Stack>

                    {acceptances.data.length === 0 && (
                        <Box sx={{textAlign: 'center', py: 8}}>
                            <Biotech sx={{fontSize: 64, color: 'text.disabled', mb: 2}}/>
                            <Typography variant="h6" color="text.secondary">
                                No test results found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Your lab test results will appear here
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
                        <TablePagination
                            component="div"
                            count={acceptances.total}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handlePageSizeChange}
                            page={acceptances.current_page - 1}
                            rowsPerPage={acceptances.per_page}
                            rowsPerPageOptions={[10, 20, 50]}
                        />
                    </Box>
                </Box>
            );
        }

        // Desktop Table View
        return (
            <TableContainer component={Paper} sx={{overflowX: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Registered At</TableCell>
                            <TableCell>Last Update</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {acceptances.data.map((acceptance, index) => (
                            <TableRow key={acceptance.id} hover>
                                <TableCell>{startRow + index + 1}</TableCell>
                                <TableCell>
                                    {new Date(acceptance.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    {new Date(acceptance.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={acceptance.status || 'Pending'}
                                        size="small"
                                        color={getStatusColor(acceptance.status)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={show(acceptance.id)}
                                        aria-label="View test details"
                                    >
                                        <RemoveRedEye/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={acceptances.total}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handlePageSizeChange}
                                page={acceptances.current_page - 1}
                                rowsPerPage={acceptances.per_page}
                                rowsPerPageOptions={[10, 20, 50, 100]}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{mb: 2, fontWeight: 600}}>
                Lab Results
            </Typography>
            <Divider sx={{mb: 2}}/>

            <NationalIdPicker nationalIds={nationalIds} selectedNationalId={selectedNationalId}/>

            {renderResults()}
        </Box>
    );
}

Index.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Lab Results"}]} children={page}
                                      head={"Lab Results"}/>
export default Index;
