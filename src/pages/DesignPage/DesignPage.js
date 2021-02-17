import { Typography } from '@material-ui/core'
import React from 'react'
import { useParams } from 'react-router-dom'

export const DesignPage = () => {

    const { id } = useParams();

    console.log(id);

    return (
        <>
            <Typography variant='h4'>DesignPage</Typography>
            <hr/>
        </>
    )
}
