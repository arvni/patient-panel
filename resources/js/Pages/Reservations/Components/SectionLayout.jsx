import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Box,
    IconButton,
    Fade,
} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";

const SectionLayout = ({component, title, show, handleBack, handleExit, actions = []}) => {
    const hasAction = (handleExit || handleBack || Boolean(actions.length));

    return (
        <Fade in={show} timeout={300}>
            <Box sx={{ display: show ? 'block' : 'none' }}>
                <Card
                    elevation={0}
                    sx={{
                        background: 'transparent',
                        mb: 0,
                    }}
                >
                    {/* Compact Header with Back Button */}
                    <CardHeader
                        sx={{
                            py: { xs: 1.5, md: 2 },
                            px: { xs: 1, md: 2 },
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,245,245,0.9) 100%)',
                        }}
                        avatar={
                            handleBack && (
                                <IconButton
                                    onClick={handleBack}
                                    size="small"
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' }
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                            )
                        }
                        title={title}
                        titleTypographyProps={{
                            variant: 'h6',
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: { xs: '1rem', md: '1.25rem' }
                        }}
                    />

                    {/* Compact Content Area */}
                    <CardContent
                        sx={{
                            p: { xs: 2, md: 3 },
                            '&:last-child': { pb: { xs: 2, md: 3 } },
                            minHeight: 'auto',
                        }}
                    >
                        {component}
                    </CardContent>

                    {/* Actions Footer - Only if Exit or custom actions */}
                    {(handleExit || actions.length > 0) && (
                        <CardActions
                            sx={{
                                p: 2,
                                pt: 0,
                                justifyContent: 'flex-end',
                                gap: 1,
                            }}
                        >
                            {handleExit && (
                                <Button
                                    variant="outlined"
                                    onClick={handleExit}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Exit
                                </Button>
                            )}
                            {actions}
                        </CardActions>
                    )}
                </Card>
            </Box>
        </Fade>
    );
}

export default SectionLayout;
