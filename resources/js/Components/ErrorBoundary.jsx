import React from "react";
import {Box, Button, Typography} from "@mui/material";

/**
 * Shows a reload screen instead of a blank page when rendering crashes,
 * e.g. after a browser extension or translator changed the page's text.
 */
export default class ErrorBoundary extends React.Component {
    state = {failed: false};

    static getDerivedStateFromError() {
        return {failed: true};
    }

    componentDidCatch(error, info) {
        console.error(error, info.componentStack);
    }

    render() {
        if (!this.state.failed)
            return this.props.children;
        return <Box sx={{textAlign: "center", px: 2, py: 8}}>
            <Typography variant="h6" gutterBottom>Something went wrong</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                If your browser is translating this page, turn translation off and try again.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>Reload</Button>
        </Box>;
    }
}
