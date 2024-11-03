import * as React from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";

import PasswordField from "./PasswordField";
import SelectSearch from "./SelectSearch";


const FormField = ({
                       field: {type, ...rest},
                       onchange,
                   }) => {
    switch (type) {
        case "textarea":
            return <TextField {...rest} multiline fullWidth/>
        case "text":
        case "email":
        case "number":
            return <TextField {...rest} type={type} fullWidth inputProps={{type}}/>
        case "date":
            return <TextField
                {...rest}
                id={rest.name + "-date"}
                defaultValue={rest.value}
                onChange={onchange}
                name={rest.name}
                type={"date"}
                label={rest.label}
                sx={{width: 220}}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        case "password":
            return <PasswordField {...rest} onChange={onchange} fullwidth/>
        case "description":
            return <Typography>{rest.value}</Typography>
        case "checkbox":
            return <FormControlLabel
                control={<Checkbox defaultChecked={rest.value} name={rest.name}/>}
                label={rest.label}/>
        case "selectSearch":
            return <SelectSearch  onchange={onchange} url={rest?.url??""} {...rest}/>
        case "select":
            return <FormControl fullWidth>
                <InputLabel id={`${rest.name}-select-label`}>{rest.label}</InputLabel>
                <Select labelId={`${rest.name}-select-label`} id={`${rest.name}-select`} {...rest} onChange={onchange}>
                    {rest.options?rest.options.map((option, index) => <MenuItem value={option.value}
                                                                   key={index}>{option.label}</MenuItem>):null}
                </Select>
            </FormControl>;
    }
}
export default FormField;
