import Authenticated from "@/Layouts/AuthenticatedLayout";
import {lazy, Suspense, useEffect, useState} from "react";
import {Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
import {saveAs} from 'file-saver';

const PdfViewer = lazy(() => import("@/Pages/Acceptance/Components/PdfViewer"));

// The file name the server sent, or a fallback.
const fileNameOf = (response, fallback) => {
    const matches = (response.headers['content-disposition'] || '').match(/filename="?([^";]+)"?/);
    return matches ? matches[1] : fallback;
};

/**
 * One file of the report, loaded once and shown in the page (PDF or image) with its
 * own Download button. With `optional`, a missing file (404) shows nothing at all.
 */
const ReportFile = ({title, url, fallbackName, optional = false}) => {
    const [file, setFile] = useState(null);
    const [state, setState] = useState("loading");

    useEffect(() => {
        let objectUrl = null;
        axios.get(url, {responseType: 'blob'})
            .then(response => {
                const type = response.headers['content-type'] || '';
                const blob = new Blob([response.data], {type});
                objectUrl = URL.createObjectURL(blob);
                setFile({blob, type, name: fileNameOf(response, fallbackName), url: objectUrl});
                setState("ready");
            })
            .catch(error => setState(optional && error.response?.status === 404 ? "none" : "error"));
        return () => objectUrl && URL.revokeObjectURL(objectUrl);
    }, [url]);

    if (state === "none")
        return null;

    return <Box sx={{mb: 4}}>
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
}

const Show = ({acceptanceItem}) => {
    const params = {acceptanceItem: acceptanceItem.id, acceptance: acceptanceItem.acceptance_id};
    return <>
        <ReportFile title="Report" url={route("acceptanceItems.report", params)} fallbackName="report.pdf"/>
        <ReportFile title="Clinical comment" url={route("acceptanceItems.clinicalComment", params)}
                    fallbackName="clinical-comment.pdf" optional/>
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
