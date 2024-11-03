import React, {useEffect, useState, useRef} from "react";
import {Autocomplete, TextField} from "@mui/material";
import axios from "axios";


const SelectSearch = ({
                          value,
                          onchange,
                          name = "",
                          url = "",
                          helperText = "",
                          label = "",
                          error = false,
                          required = false,
                          disabled = false
                      }) => {
    const ref = useRef();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleSearch = (_, newInputValue) => {
        searchText(newInputValue);
    }
    const searchText = (v) => {
            setLoading(true);
            axios.get(url, {data: {search: v}}).then((result) => {
                setData(result.data.data);
                setLoading(false);
            });
    }
    const handleChange = (_, value) => {
        onchange({target:{name,value}});
    }

    return <Autocomplete
        ref={ref}
        defaultValue={value}
        onChange={handleChange}
        onInputChange={handleSearch}
        options={data}
        fullWidth
        disabled={disabled}
        getOptionLabel={(option) => option.title}
        loading={loading}
        renderInput={(params) => <TextField {...params} helperText={helperText} error={error} label={label}
                                            required={required}/>}
    />;
}
export default SelectSearch;
