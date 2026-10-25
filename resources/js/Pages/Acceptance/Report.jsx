import Authenticated from "@/Layouts/AuthenticatedLayout";
import {lazy, Suspense, useEffect, useState} from "react";
import {Badge, Box, Button, CircularProgress, Stack, Tab, Tabs, Typography} from "@mui/material";
import {saveAs} from 'file-saver';

const PdfViewer = lazy(() => import("@/Pages/Acceptance/Components/PdfViewer"));

// The file name the server sent, or a fallback.
const fileNameOf = (response, fallback) => {
    const matches = (response.headers['content-disposition'] || '').match(/filename="?([^";]+)"?/);
    return matches ? matches[1] : fallback;
};

/**
 * Loads one file of the report once: {state: loading | ready | none | error, file}.
 * With `optional`, a missing file (404) is "none".
 */
const useReportFile = (url, fallbackName, optional = false) => {
    const [result, setResult] = useState({state: "loading", file: null});

    useEffect(() => {
        let objectUrl = null;
        axios.get(url, {responseType: 'blob'})
            .then(response => {
                const type = response.headers['content-type'] || '';
                const blob = new Blob([response.data], {type});
                objectUrl = URL.createObjectURL(blob);
                setResult({state: "ready", file: {blob, type, name: fileNameOf(response, fallbackName), url: objectUrl}});
            })
            .catch(error => setResult({state: optional && error.response?.status === 404 ? "none" : "error", file: null}));
        return () => objectUrl && URL.revokeObjectURL(objectUrl);
    }, [url]);

    return result;
};

// One file, shown in the page (PDF or image) with its own Download button.
const ReportFile = ({title, state, file}) => <Box>
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
        <Typography variant="h6">{title}</Typography>
        <Button variant="outlined" disabled={state !== "ready"} onClick={() => saveAs(file.blob, file.name)}>
            Download
        </Button>
    </Stack>
    {state === "loading" && <Box sx={{textAlign: "center", py: 4}}><CircularProgress/></Box>}
    {state === "error" && <Typography color="error">This file couldn't be loaded. Please try again later.</Typography>}
    {state === "ready" && (file.type.includes("pdf")
        ? <Suspense fallback={<div>Loading...</div>}><PdfViewer fileUrl={file.url}/></Suspense>
        : file.type.startsWith("image/")
            ? <Box component="img" src={file.url} alt={title} sx={{display: "block", maxWidth: "100%", mx: "auto"}}/>
            : <Typography>Use Download to open this file.</Typography>)}
</Box>;

/**
 * The report and, when the lab added one, its clinical comment as a second tab, so the
 * comment is one tap away instead of below every page of the report.
 */
const Show = ({acceptanceItem}) => {
    const params = {acceptanceItem: acceptanceItem.id, acceptance: acceptanceItem.acceptance_id};
    const report = useReportFile(route("acceptanceItems.report", params), "report.pdf");
    const comment = useReportFile(route("acceptanceItems.clinicalComment", params), "clinical-comment.pdf", true);
    const [tab, setTab] = useState("report");
    // The tab appears once the comment is known to exist, so tests without one never flicker.
    const hasComment = comment.state === "ready" || comment.state === "error";

    return <>
        {hasComment && <Tabs value={tab} onChange={(e, value) => setTab(value)} variant="fullWidth"
                             sx={{mb: 2, borderBottom: 1, borderColor: "divider"}}>
            <Tab value="report" label="Report"/>
            <Tab value="comment" label={<Badge color="info" variant="dot" invisible={tab === "comment"}
                                               sx={{"& .MuiBadge-badge": {right: -6}}}>Clinical comment</Badge>}/>
        </Tabs>}
        {tab === "comment" && hasComment
            ? <ReportFile title="Clinical comment" {...comment}/>
            : <ReportFile title="Report" {...report}/>}
    </>;
}
Show.layout = page => <Authenticated head={page.props.acceptanceItem.test + " Test Report"}
                                     auth={page.props.auth}
                                     children={page}
                                     breadcrumbs={[
                                         {
                                             title: "Tests",
                                             link: route("acceptances.index")
                                         },
                                         {
                                             title: "Test " + new Date(page.props.acceptance.created_at).toDateString(),
                                             link: route("acceptances.show", page.props.acceptance.id)
                                         },
                                         {
                                             title: page.props.acceptanceItem.test + " Test Report",
                                         },
                                     ]}
/>
export default Show;
