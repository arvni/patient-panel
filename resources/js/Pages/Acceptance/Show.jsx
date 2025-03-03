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
} from "@mui/material";
import {useState} from "react";
import {router} from "@inertiajs/react";

const Row = ({acceptanceItem}) => {
    const [open, setOpen] = useState(true);
    const steps = [
        {
            label: "Registering",
            key: 1
        },
        {
            label: "Sampling",
            key: 2
        },
        {
            label: "Processing",
            key: 3
        },
        {
            label: "Reported",
            key: 4
        }
    ];
    const activeKey = [1, 2, 3, 4].filter(value => !Object.keys(acceptanceItem.timeline).includes(value + ""))[0];
    const handleDownload = () => router.visit(route("acceptanceItems.show", {
        acceptanceItem:acceptanceItem.id,
        acceptance:acceptanceItem.acceptance_id
    }));
    const handleCollapse = () => setOpen(prevState => !prevState);
    return <>
        <TableRow key={"row-1-" + acceptanceItem.id}>
            <TableCell>
                <a href={"#"} onClick={handleCollapse}>{acceptanceItem.test}</a>
            </TableCell>
            <TableCell>
                {acceptanceItem.status}
            </TableCell>
            <TableCell>
                <Button onClick={handleDownload} disabled={acceptanceItem.status !== "reported"}>View Report</Button>
            </TableCell>
        </TableRow>
        <TableRow key={"row-2-" + acceptanceItem.id}>
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={3}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Stepper nonLinear alternativeLabel sx={{marginTop: 1}}
                             activeStep={activeKey - 1}>
                        {steps.map((step, index) => (
                            <Step key={step.key} completed={(acceptanceItem.timeline).hasOwnProperty(step.key)}>
                                <StepButton color="inherit">
                                    {step.label}<br/>
                                    <small>{acceptanceItem.timeline[step?.key]}</small>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

const Show = ({acceptance}) => {
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>
                    Test Name
                </TableCell>
                <TableCell>
                    Status
                </TableCell>
                <TableCell>
                    Report
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {acceptance.acceptance_items.map(item => <Row key={item.id} acceptanceItem={item}/>)}
        </TableBody>
    </Table>;
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
