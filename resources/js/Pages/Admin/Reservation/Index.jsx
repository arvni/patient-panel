import React from "react";
import {Alert, IconButton, Paper, Stack} from "@mui/material";
import PageHeader from "../Components/PageHeader";
import TableLayout from "@/Layouts/TableLayout";
import {usePageReload} from "@/services/api";
import AdminLayout from "@/Layouts/AdminLayout";
import {RemoveRedEye} from "@mui/icons-material";
import {router} from "@inertiajs/react";


const Index = ({auth, reservations: {data: reservationsData, ...pagination}, status, request={}}) => {
    const {
        data,
        processing,
        reload,
        onPageSizeChange,
        onOrderByChange,
        onFilterChange,
        onPageChange
    } = usePageReload(request, ["reservations"]);

    const columns = [
        {
            field: "name",
            title: "Name",
            type: "text",
            filter: {
                name: "name",
                label: "Name",
                type: "text",
                value: data?.filter?.name
            },
            render: (row) => row?.customer?.name,
            sortable: false,
        },
        {
            field: "doctor_title",
            title: "Doctor",
            filter: {
                name: "doctor",
                label: "Doctor",
                type: "selectSearch",
                value: data?.filter?.doctor,
                url: route("doctors.list")
            },
            sortable: true,
        },
        {
            field: "mobile",
            title: "Mobile",
            type: "text",
            filter: {
                name: "mobile",
                label: "Mobile",
                type: "text",
                value: data?.filter?.mobile
            },
            sortable: false,
            render: (row) => row?.customer?.mobile,
        },
        {
            field: "email",
            title: "Email",
            type: "email",
            filter: {
                name: "email",
                label: "Email",
                type: "text",
                value: data?.filter?.email
            },
            sortable: false,
            render: (row) => row?.customer?.email,
        },
        {
            field: "type",
            title: "Type",
            filter: {
                name: "type",
                label: "Type",
                type: "select",
                value: data?.filter?.type,
                options: [{value: 1, label: "Online"}, {value: 2, label: "In Person"},]
            },
            sortable: false,
            render: (row) => row?.type == 1 ? "In Person" : "Online",
        },
        {
            field: "time.started_at",
            title: "Date",
            filter: {
                name: "date",
                label: "Date",
                type: "date",
                value: data?.filter?.date
            },
            sortable: false,
            render: (row) => row.time.started_at + " - " + row.time.ended_at
        },
        {
            field: "verified",
            title: "Verified",
            type: "boolean",
            sortable: true,
        },
        {
            field: "id",
            title: "#",
            type: "actions",
            render: (row) => <Stack direction="row" spacing={1}>
                <IconButton onClick={handleShowRoom(row.id)}>
                    <RemoveRedEye/>
                </IconButton>
            </Stack>
        }
    ];


    const handlePage = (e) => {
        e.preventDefault();
        reload();
    };

    const handleShowRoom = (id) => () => router.visit(route("admin.reservations.show", id));

    return (
        <AdminLayout user={auth.user} header="Reservations">
            {status && <Alert>{status}</Alert>}
            <PageHeader
                title="Reservations"
            />
            <Paper sx={{mt: "3em", p: "1rem", overflowX: "auto"}}>
                <TableLayout
                    columns={columns}
                    data={reservationsData}
                    onPageChange={onPageChange}
                    pagination={pagination}
                    onFilterChange={onFilterChange}
                    onFilter={handlePage}
                    filter
                    onOrderByChange={onOrderByChange}
                    loading={processing}
                    tableModel={{
                        orderBy: data?.orderBy || {
                            field: "id",
                            type: "asc"
                        },
                        page: data?.page,
                        filter: data?.filter
                    }}
                    pageSize={{
                        defaultValue: data?.pageSize || 10,
                        onChange: onPageSizeChange
                    }}
                />
            </Paper>
        </AdminLayout>
    );
};

export default Index;
