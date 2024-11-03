import React, {useState} from "react";
import {Alert, Backdrop, Button, CircularProgress, IconButton, Paper, Stack} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {Edit, PasswordOutlined} from "@mui/icons-material";
import PageHeader from "../Components/PageHeader";
import AddForm from "./Components/AddForm";
import TableLayout from "@/Layouts/TableLayout";
import {useGetData, usePageReload} from "@/services/api";
import ChangePasswordForm from "../Components/ChangePasswordForm";
import AdminLayout from "@/Layouts/AdminLayout";

const defaultUser = {
    id: undefined,
    name: "",
    userName: "",
    email: "",
    active: true,
    password: ""
}

const Index = ({auth, users: {data: usersData, ...pagination}, status, request}) => {
    const {
        data,
        processing,
        reload,
        onPageSizeChange,
        onOrderByChange,
        onFilterChange,
        onPageChange
    } = usePageReload(request, ["users"]);
    const {loading, getData} = useGetData();
    const [user, setUser] = useState(defaultUser);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [openChangePasswordForm, setOpenChangePasswordForm] = useState(false);

    const handleOpenAddForm = () => setOpenAddForm(true);
    const handleOpenChangePasswordForm = (user) => () => {
        setUser(user);
        setOpenChangePasswordForm(true);
    }
    const handleCloseChangePasswordForm = () => {
        resetUser();
        setOpenChangePasswordForm(false);
    }
    const handleCloseAddForm = () => {
        setOpenAddForm(false);
        resetUser();
    };

    const resetUser = () => {
        setUser(defaultUser);
    };

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
            sortable: true,
        },
        {
            field: "userName",
            title: "userName",
            type: "text",
            filter: {
                name: "userName",
                label: "userName",
                type: "text",
                value: data?.filter?.userName
            },
            sortable: true,
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
            sortable: true,
        },
        {
            field: "id",
            title: "#",
            type: "actions",
            render: (row) => <Stack direction="row" spacing={1}>
                <IconButton onClick={handleEdit(row.id)}><Edit/></IconButton>
                <IconButton onClick={handleOpenChangePasswordForm(row)}><PasswordOutlined/></IconButton>
            </Stack>
        }
    ];

    const handleEdit = (id) => () => {
        getData(route("admin.users.show",id))
            .then((res) => setUser(res.data))
            .then(handleOpenAddForm);
    };


    const handlePage = (e) => {
        e.preventDefault();
        reload();
    };

    return (
        <AdminLayout user={auth.user} header="Users">
            {status && <Alert>{status}</Alert>}
            <PageHeader
                title="Users"
                actions={
                    <Button variant="contained" onClick={handleOpenAddForm} color="success" startIcon={<AddIcon/>}>
                        Add
                    </Button>
                }
            />
            {openAddForm && <AddForm open={openAddForm} onClose={handleCloseAddForm} defaultValue={user}/>}
            <Paper sx={{mt: "3em", p: "1rem"}}>
                <TableLayout
                    columns={columns}
                    data={usersData}
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
            <ChangePasswordForm open={openChangePasswordForm} onClose={handleCloseChangePasswordForm} user={user}/>
        </AdminLayout>
    );
};

export default Index;
