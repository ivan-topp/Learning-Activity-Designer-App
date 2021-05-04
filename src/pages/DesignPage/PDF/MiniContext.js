import { useState } from "react";

export const MiniContext = () => {
    const [ confirmDateConfiguration, setDateConfiguration] = useState(false);
    const [ selectedDate, setSelectedDate ] = useState(new Date(Date.now()));
    const [ privileges, setPrivileges ] = useState([]);
    const [ expanded, setExpanded] = useState(false);

    return {
        confirmDateConfiguration,
        setDateConfiguration,
        expanded, 
        setExpanded,
        selectedDate,
        setSelectedDate,
        privileges, 
        setPrivileges
    }
}
