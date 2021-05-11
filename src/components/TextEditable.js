import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Edit, Save } from '@material-ui/icons';

export const TextEditable = forwardRef(({ name, value, onSave, ...rest }, ref) => {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value, setText]);

    const handleSave = useCallback(
        () => {
            const e  = {
                target: { name, value: text }
            };
            if(onSave) onSave(e);
            setEditing(false);
        },
        [name, onSave, text],
    );

    useImperativeHandle(
        ref,
        () => ({
            editing,
            handleSave
        }),
    );

    const handleEdit = () => {
        setEditing(true);
    };

    const handleChange = ({target}) => {
        setText(target.value);
    };

    return (
        <TextField
            name={name}
            disabled={!editing}
            value={text}
            onChange={handleChange}
            InputProps={{
                readOnly: !editing,
                endAdornment:
                    <IconButton
                        onClick={editing ? handleSave : handleEdit }
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {editing ? <Save /> : <Edit />}
                    </IconButton>
            }}
            {...rest}
        />
    )
})
