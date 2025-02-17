import Authenticated from "@/Layouts/AuthenticatedLayout";
import {lazy, Suspense} from "react";


const PdfViewer = lazy(() => import("@/Pages/Acceptance/Components/PdfViewer"));

const Show = ({acceptanceItem}) => {
    const pdfUrl = route("acceptanceItems.report", {
        acceptanceItem: acceptanceItem.id,
        acceptance: acceptanceItem.acceptance_id
    });
    console.info(pdfUrl);
    return <Suspense fallback={<div>Loading...</div>}>
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
