import React, {useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import styled from "@emotion/styled";
import Stack from "@mui/material/Stack";
import {Dialog, FormHelperText} from "@mui/material";

const FileInput = styled.input`
display:none;
position:absolute;
`

const AvatarUploader = ({value, onChange, name, uploadUrl, disabled = false, error = false, helperText = null}) => {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const Input = useRef(null);
    const inputClicked = () => {
        if (disabled)
            setOpenImage(true);
        else
            Input.current.click();
    }
    const closeImgViewer = () => {
        setOpenImage(false)
    }
    const onFileSelected = async (e) => {
        setLoading(true);
        const fr = new FileReader();
        fr.onloadend = event => {
            setUrl(event.target.result);
        };
        fr.readAsDataURL(e.target.files[0]);
        let formData = new FormData();
        formData.append("file", e.target.files[0]);
        axios.post(uploadUrl, formData).then((res) => {
            onChange(res);
            setLoading(false);
        });
    }
    useEffect(() => {
        if (typeof value == "string")
            setUrl(value);
    }, [value]);
    return (<Stack direction="column" justifyItems="center">
        <FileInput type="file" ref={Input} onChange={onFileSelected} name={name} accept=".jpg,.png,.jpeg"/>
        <Button onClick={inputClicked} color={error ? "error" : "inherit"}
                sx={{p: 0, m: "auto", width: "20em", height: "20em", borderRadius: "1em", overflow: "hidden"}}
                variant="outlined">
            {!!url && !loading &&
            <img src={url} style={{width: "100%", maxHeight: "100%"}}/>}
            {loading && <CircularProgress disableShrink/>}
            {!loading && !url && "Upload"}
        </Button>
        <Dialog open={openImage} onClose={closeImgViewer} maxWidth={"lg"}>
            <img src={url}/>
        </Dialog>
        {helperText && <FormHelperText sx={{textAlign: "center"}} error>{helperText}</FormHelperText>}
    </Stack>);
}

export default AvatarUploader;
