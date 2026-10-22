import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

const PdfJsViewer = ({ fileUrl }) => {
    const [numPages, setNumPages] = useState(0);
    const canvasRefs = useRef([]);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    // Function to render PDF pages
    const renderPdf = useCallback(async () => {
        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const pdf = await loadingTask.promise;
            setNumPages(pdf.numPages);

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);

                // Get container width dynamically
                const container = canvasRefs.current[pageNum - 1]?.parentElement;
                if (!container) continue;
                const containerWidth = container.clientWidth;

                // Sharp on the screen's own pixel density, at most 2x: 3x pages of a long report
                // used ~65 MB each and left later pages blank on phones.
                const density = Math.min(window.devicePixelRatio || 1, 2);
                const scale = (containerWidth / page.getViewport({ scale: 1 }).width) * density;
                const viewport = page.getViewport({ scale });

                const canvas = canvasRefs.current[pageNum - 1];
                if (canvas) {
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // Scale visually for better quality
                    canvas.style.width = `${viewport.width / density}px`;
                    canvas.style.height = `${viewport.height / density}px`;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };

                    await page.render(renderContext);
                }
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    }, [fileUrl, viewportWidth]);

    // Handle window resize event to re-render PDF
    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Re-render PDF when viewportWidth changes
    useEffect(() => {
        renderPdf();
    }, [renderPdf]);

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            {Array.from({ length: numPages }, (_, index) => (
                <canvas
                    key={index}
                    ref={(el) => (canvasRefs.current[index] = el)}
                    style={{
                        display: 'block',
                        margin: '0 auto',
                    }}
                />
            ))}
        </div>
    );
};

export default PdfJsViewer;
