import {Avatar, Box, Card, CardContent, Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";


const NewToggleButton = ({title, value, selected, icon, disabled, ...rest}) => {
    return (
        <ToggleButton
            {...rest}
            value={value}
            selected={selected}
            aria-label={title}
            disabled={disabled}
            sx={{
                border: "2px solid",
                borderColor: selected ? "primary.main" : "grey.300",
                borderRadius: 3,
                p: { xs: 2, md: 3 },
                flex: 1,
                transition: 'all 0.3s ease',
                backgroundColor: selected ? 'primary.light' : 'background.paper',
                "&:hover": {
                    backgroundColor: selected ? 'primary.light' : 'grey.50',
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                },
                "&.Mui-selected": {
                    backgroundColor: 'primary.light',
                    borderColor: "primary.main",
                    borderWidth: 2,
                    '&:hover': {
                        backgroundColor: 'primary.light',
                    }
                }
            }}
        >
            <Stack spacing={1.5} alignItems="center">
                {icon && (
                    <Box
                        sx={{
                            borderRadius: "50%",
                            width: { xs: 100, md: 120 },
                            height: { xs: 100, md: 120 },
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            bgcolor: selected ? 'primary.main' : 'grey.200',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <img
                            src={icon}
                            width={selected ? "80px" : "70px"}
                            height={selected ? "80px" : "70px"}
                            style={{ transition: 'all 0.3s ease' }}
                            alt={title}
                        />
                    </Box>
                )}
                <Typography
                    variant="h6"
                    fontWeight={selected ? 700 : 500}
                    color={selected ? 'primary.dark' : 'text.primary'}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                    {title}
                </Typography>
            </Stack>
        </ToggleButton>
    );
}

const ReservationTypeSection = ({selectedType = "", onSelect}) => {
    const types = [
        {
            value: 2,
            title: "Online",
            icon: "/images/online.png",
            disabled: false
        },
        {
            value: 1,
            title: "In Person",
            icon: "/images/in-person.png",
            disabled: false
        },
    ]
    return (
        <ToggleButtonGroup
            value={selectedType}
            exclusive
            onChange={onSelect}
            sx={{
                display: "flex",
                width: "100%",
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    '&:not(:first-of-type)': {
                        borderRadius: 3,
                    },
                    '&:first-of-type': {
                        borderRadius: 3,
                    },
                },
            }}
            aria-label="Reservation Type"
        >
            {types.map(type => (
                <NewToggleButton
                    title={type.title}
                    value={type.value}
                    icon={type?.icon}
                    disabled={type.disabled}
                    selected={selectedType == type.value}
                    key={"type-" + type.value}
                />
            ))}
        </ToggleButtonGroup>
    );
}

export default ReservationTypeSection;
