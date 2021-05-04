

export const exportJsonToFile = (json='', filename = 'example.json') => {
    if(typeof json === 'object') json = JSON.stringify(json);
    let auxElement = document.createElement('a');
    auxElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
    auxElement.setAttribute('download', filename);
    auxElement.click();
}