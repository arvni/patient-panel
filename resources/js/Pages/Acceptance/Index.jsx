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


const Index = ({acceptances, request}) => {
    const startRow = (request.page - 1) * request.pageSize;
    const show = (id) => e => {
        e.preventDefault();
        router.visit(route("acceptances.show", id));
    }
    const handlePageChange = (e, page) => reloadPage(page + 1, request.pageSize, request.filters);
    const handlePageSizeChange = (e) => reloadPage(1, e.target.value, request.filters);
    const reloadPage = (page, pageSize, filters) => router.visit(route("acceptances.index"), {
        data: {page, pageSize, filters},
        only: ["acceptances", "request"]
    })
    return <>
        <Typography variant={"h4"}> Tests List</Typography>
        <Divider/>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Registered At</TableCell>
                    <TableCell>Lat Update At</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {acceptances.data.map((acceptance, index) => <TableRow key={acceptance.id}>
                    <TableCell
                        key={"row-" + acceptance.id}>{startRow + index + 1}</TableCell>
                    <TableCell
                        key={"created_at-" + acceptance.ie}>{new Date(acceptance.created_at).toDateString()}</TableCell>
                    <TableCell
                        key={"updated_at-" + acceptance.ie}>{new Date(acceptance.updated_at).toDateString()}</TableCell>
                    <TableCell key={"status-" + acceptance.id}>{acceptance.status}</TableCell>
                    <TableCell key={"action-" + acceptance.id}>
                        <IconButton color={"primary"} href={route("acceptances.show", acceptance.id)}
                                    onClick={show(acceptance.id)}>
                            <RemoveRedEye/>
                        </IconButton>
                    </TableCell>
                </TableRow>)}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination count={acceptances.total}
                                     onPageChange={handlePageChange}
                                     onRowsPerPageChange={handlePageSizeChange}
                                     page={acceptances.current_page - 1}
                                     rowsPerPage={acceptances.per_page}
                                     rowsPerPageOptions={[100, 20, 10]}/>
                </TableRow>
            </TableFooter>
        </Table>
    </>;
}

Index.layout = page => <Authenticated auth={page.props.auth} breadcrumbs={[{title: "Tests"}]} children={page}
                                      head={"Tests"}/>
export default Index;
