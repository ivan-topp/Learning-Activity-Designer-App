export const formatName = (name, lastname) => {
    const firstName = name.split(' ')[0];
    const firstLastname = lastname.split(' ')[0];
    return `${ firstName } ${ firstLastname }`;
};

export const getUserInitials = (name, lastname) => {
    return `${ name.substring(0, 1) + lastname.substring(0, 1) }`;
};