import {Grid, Paper} from "@mui/material";
import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const Dashboard=()=> {
    return (<Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >

                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >

                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>

                    </Paper>
                </Grid>
            </Grid>
    );
}
Dashboard.layout=(page)=> <AdminLayout user={page.props.auth.user} header="Dashboard">
    {page}
</AdminLayout>;
export default Dashboard;
