import {Alert, AlertTitle, Box, Button, Popper, Stack} from "@mui/material";
import {router} from "@inertiajs/react";
import {useSnackbar} from "notistack";
import {useState} from "react";

const ToggleForm = ({availableTime, onAgree}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const {enqueueSnackbar} = useSnackbar();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDisagree = () => setAnchorEl(null);
    const handleAgree = () => {
        router.post(route("admin.availableTimes.toggle", availableTime.id), {_method: "put"}, {
            onSuccess: () => {
                setAnchorEl(null);
                onAgree();
            },
            onError: (e) => {
                Object.keys(obj).forEach(key => enqueueSnackbar(obj[key], {variant: "error"}))
            }
        })
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    return <>
        <Button aria-describedby={id} type="button" onClick={handleClick}>
            {availableTime.is_active ? "Disable" : "Enable"}
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} sx={{zIndex:"10000"}}>
            <Box sx={{border: 1, p: 1, bgcolor: 'background.paper'}}>
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    Do You Want To {availableTime.is_active ? "Disable" : "Enable"} This Time ?
                </Alert>
                <Stack direction="row" justifyContent="flex-end">
                    <Button onClick={handleAgree}>Agree</Button>
                    <Button onClick={handleDisagree}>Disagree</Button>
                </Stack>
            </Box>
        </Popper>
    </>
}
export default ToggleForm;
