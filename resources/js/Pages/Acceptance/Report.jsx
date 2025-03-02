import Authenticated from "@/Layouts/AuthenticatedLayout";
import {lazy, Suspense} from "react";
import {Button} from "@mui/material";
import {saveAs} from 'file-saver';

const PdfViewer = lazy(() => import("@/Pages/Acceptance/Components/PdfViewer"));

const Show = ({acceptanceItem}) => {
    const pdfUrl = route("acceptanceItems.report", {
        acceptanceItem: acceptanceItem.id,
        acceptance: acceptanceItem.acceptance_id
    });
    const downloadReport = () => {
        axios.get(pdfUrl, {responseType: 'blob'}) // Ensure responseType is set to 'blob'
            .then(response => {
                // Get the Content-Disposition header
                const contentDisposition = response.headers['content-disposition'];

                // Initialize a default filename
                let fileName = 'default_filename.pdf';

                if (contentDisposition) {
                    // Use a regular expression to extract the filename from the header
                    const matches = contentDisposition.match(/filename="([^"]+)"/);
                    if (matches && matches[1]) {
                        fileName = matches[1]; // Extracted filename
                    }
                }
                // Extract the content-type from the headers
                const contentType = response.headers['content-type'];

                // Create a Blob from the response data
                const blob = new Blob([response.data], {type: contentType});

                // Use FileSaver.js to trigger the download
                saveAs(blob, fileName); // Specify the desired filename here
            })
            .catch(error => {
                console.error('Error downloading the file:', error);
            });

    }
    return <Suspense fallback={<div>Loading...</div>}>
        <Button onClick={downloadReport}>Download</Button>
        <PdfViewer fileUrl={pdfUrl}/>
    </Suspense>;
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
