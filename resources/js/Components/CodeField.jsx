import {forwardRef, useCallback, useEffect, useRef, useState} from 'react';
import {Input, Stack} from "@mui/material";
import styled from "@emotion/styled";

const VerificationInput = styled(Input)(({theme}) => ({
    width: "2rem",
    fontSize: "1.4rem",
    fontWeight: "600",
    color: theme.palette.secondary.main,
    input: {textAlign: "center "},
    // hide arrows
    appearance: "textfield",
    "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0
    }
}));

export default forwardRef(function CodeField({name, onChange, length = 4, ...props}, ref) {
    const input = ref ? ref : useRef();
    const [code, setCode] = useState(Array(length).fill(""));
    const update = useCallback((index, val) => {
        return setCode((prevState) => {
            const slice = prevState.slice();
            slice[index] = val;
            onChange(name, slice.join(""));
            return slice;
        });
    }, []);

    function handleKeyDown(evt) {
        const index = parseInt(evt.currentTarget.dataset.index);
        const form = input.current;
        if (isNaN(index) || form === null) return; // just in case

        const prevIndex = index - 1;
        const nextIndex = index + 1;
        const prevInput = form.querySelector(`.code-input-${prevIndex}`);
        const nextInput = form.querySelector(`.code-input-${nextIndex}`);
        switch (evt.key) {
            case "Backspace":
                if (code[index]) update(index, "");
                else if (prevInput) prevInput.select();
                break;
            case "ArrowRight":
                evt.preventDefault();
                if (nextInput) nextInput.focus();
                break;
            case "ArrowLeft":
                evt.preventDefault();
                if (prevInput) prevInput.focus();
        }
    }

    function handleChange(evt) {
        const value = evt.currentTarget.value;

        const index = parseInt(evt.currentTarget.dataset.index);
        const form = input.current;
        if (isNaN(index) || form === null) return; // just in case

        let nextIndex = index + 1;
        let nextInput = form.querySelector(`.code-input-${nextIndex}`);

        update(index, value[0] || "");
        if (value.length === 1) nextInput?.focus();
        else if (index < length - 1) {
            const split = value.slice(index + 1, length).split("");
            split.forEach((val) => {
                update(nextIndex, val);
                nextInput?.focus();
                nextIndex++;
                nextInput = form.querySelector(`.code-input-${nextIndex}`);
            });
        }
    }

    function handleFocus(evt) {
        evt.currentTarget.select();
    }


    return (
        <Stack ref={input}
               component={"fieldset"}
               border={"none"}
               direction={"row"}
               spacing={1.2}
               justifyContent={"center"}
        >
            {code.map((value, i) => (
                <VerificationInput
                    key={i}
                    value={value}
                    error={props.error}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    inputProps={{
                        type: "number",
                        className: `code-input-${i}`,
                        "aria-label": `Number ${i + 1}`,
                        "data-index": i,
                        pattern: "[0-9]*",
                        inputtype: "numeric",
                    }}
                />
            ))}
        </Stack>
    );
});
