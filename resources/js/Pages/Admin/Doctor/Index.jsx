import React, {useState} from "react";
import {Alert, Avatar, Backdrop, Button, CircularProgress, IconButton, Paper, Stack} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {Edit, RemoveRedEye} from "@mui/icons-material";
import PageHeader from "../Components/PageHeader";
import AddForm from "./Components/AddForm";
import TableLayout from "@/Layouts/TableLayout";
import {useGetData, usePageReload} from "@/services/api";
import AdminLayout from "@/Layouts/AdminLayout";
import {router} from "@inertiajs/react";

const defaultDoctor = {
    id: undefined,
    title: "",
    subtitle: "",
    specialty: "",
}

const Index = ({auth, doctors: {data: doctorsData, ...pagination}, status, request}) => {
    const {
        data,
        processing,
        reload,
        onPageSizeChange,
        onOrderByChange,
        onFilterChange,
        onPageChange
    } = usePageReload(request, ["doctors"]);
    const {loading, getData} = useGetData();
    const [doctor, setDoctor] = useState(defaultDoctor);
    const [openAddForm, setOpenAddForm] = useState(false);

    const handleOpenAddForm = () => setOpenAddForm(true);
    const handleCloseAddForm = () => {
        setOpenAddForm(false);
        resetDoctor();
    };

    const resetDoctor = () => {
        setDoctor(defaultDoctor);
    };

    const columns = [
        {
            field: "title",
            title: "Title",
            type: "text",
            filter: {
                name: "title",
                label: "Title",
                type: "text",
                value: data?.filter?.title
            },
            sortable: true,
            render:(row)=> <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={row.image}/>
                <span>{row.title}</span>
            </Stack>
        },
        {
            field: "subtitle",
            title: "Subtitle",
            type: "text",
            filter: {
                name: "subtitle",
                label: "Subtitle",
                type: "text",
                value: data?.filter?.subtitle
            },
            sortable: true,
        },
        {
            field: "specialty",
            title: "Specialty",
            type: "specialty",
            filter: {
                name: "specialty",
                label: "Specialty",
                type: "text",
                value: data?.filter?.specialty
            },
            sortable: true,
        },
        {
            field: "id",
            title: "#",
            type: "actions",
            render: (row) => <Stack direction="row" spacing={1}>
                <IconButton onClick={handleEdit(row.id)}><Edit/></IconButton>
                <IconButton onClick={handleShow(row.id)} href={route("admin.doctors.availableTimes",row.id)}><RemoveRedEye/></IconButton>
            </Stack>
        }
    ];

    const handleEdit = (id) => () => {
        getData(route("admin.doctors.show",id))
            .then((res) => setDoctor(res.data))
            .then(handleOpenAddForm);
    };


    const handlePage = (e) => {
        e.preventDefault();
        reload();
    };
    const handleShow=id=>e=> {
        e.preventDefault();
        e.stopPropagation();
        router.visit(route("admin.doctors.availableTimes", id));
    }

    return (
        <AdminLayout user={auth.user} header="Doctors">
            {status && <Alert>{status}</Alert>}
            <PageHeader
                title="Doctors"
                actions={[
                    <Button variant="contained" onClick={handleOpenAddForm} color="success" startIcon={<AddIcon/>}>
                        Add
                    </Button>
                ]}
            />
            {openAddForm && <AddForm open={openAddForm} onClose={handleCloseAddForm} defaultValue={doctor}/>}
            <Paper sx={{mt: "3em", p: "1rem"}}>
                <TableLayout
                    columns={columns}
                    data={doctorsData}
                    onPageChange={onPageChange}
                    pagination={pagination}
                    onFilterChange={onFilterChange}
                    onFilter={handlePage}
                    filter
                    onOrderByChange={onOrderByChange}
                    loading={processing}
                    tableModel={{
                        orderBy: data.orderBy ?? {
                            field: "id",
                            type: "asc"
                        },
                        page: data.page,
                        filter: data.filter
                    }}
                    pageSize={{
                        defaultValue: data.pageSize ?? 10,
                        onChange: onPageSizeChange
                    }}
                />
            </Paper>
            <Backdrop open={loading}>
                <CircularProgress/>
            </Backdrop>
        </AdminLayout>
    );
};

export default Index;
