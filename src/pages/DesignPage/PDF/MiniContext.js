import { useState } from "react";

export const MiniContext = () => {
    const [ confirmDateConfiguration, setDateConfiguration] = useState(false);
    const [ selectedDate, setSelectedDate ] = useState(new Date(Date.now()));
    const [ privileges, setPrivileges ] = useState([]);
    

    return {
        confirmDateConfiguration,
        setDateConfiguration,
        selectedDate,
        setSelectedDate,
        privileges, 
        setPrivileges
    }
}
