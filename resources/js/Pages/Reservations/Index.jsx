import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead, TablePagination,
    TableRow, Typography
} from "@mui/material";
import {RemoveRedEye} from "@mui/icons-material";
import {router} from "@inertiajs/react";


const Index = ({reservations, request}) => {
    const startRow = (request?.page??1 - 1) * (request?.pageSize??10);
    const show = (id) => () => router.visit(route("reservations.show", id));
    const handlePageChange = (e, page) => reloadPage(page + 1, request.pageSize, request.filters);
    const handlePageSizeChange = (e) => reloadPage(1, e.target.value, request.filters);
    const reloadPage = (page, pageSize, filters) => router.visit(route("reservations.index"), {
        data: {page, pageSize, filters},
        only: ["reservations", "request"]
    })
    return <>
        <Typography variant="h4"> Reservations List</Typography>
        <Divider/>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Reservation Date</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {reservations.data.map((reservation, index) => <TableRow key={reservation.id}>
                    <TableCell
                        key={"row-" + reservation.id}>{startRow + index + 1}</TableCell>
                    <TableCell
                        key={"created_at-" + reservation.ie}>{new Date(reservation.created_at).toDateString()}</TableCell>
                    <TableCell
                        key={"updated_at-" + reservation.ie}>{new Date(reservation.updated_at).toDateString()}</TableCell>
                    <TableCell key={"status-" + reservation.id}>{reservation.status}</TableCell>
                    <TableCell key={"action-" + reservation.id}>
                        <IconButton color={"primary"} href={route("reservations.show", reservation.id)}
                                    onClick={show(reservation.id)}>
                            <RemoveRedEye/>
                        </IconButton>
                    </TableCell>
                </TableRow>)}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination count={reservations.total}
                                     onPageChange={handlePageChange}
                                     onRowsPerPageChange={handlePageSizeChange}
                                     page={reservations.current_page - 1}
                                     rowsPerPage={reservations.per_page}
                                     rowsPerPageOptions={[100, 20, 10]}/>
                </TableRow>
            </TableFooter>
        </Table>
    </>;
}

Index.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Tests"}]} children={page}
                                      head={"Tests"}/>
export default Index;
