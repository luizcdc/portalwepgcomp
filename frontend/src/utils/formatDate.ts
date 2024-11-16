export const formatDate = (dateStart: string, dateEnd: string) => {
    const d_Start = new Date(dateStart);
    const d_End = new Date(dateEnd);


    const day = String(d_Start.getDate()).padStart(2, '0');
    const month = String(d_Start.getMonth() + 1).padStart(2, '0'); 
    const year = d_Start.getFullYear();


    const hours_Start = String(d_Start.getHours()).padStart(2, '0');
    const minutes_Start = String(d_Start.getMinutes()).padStart(2, '0');

    const hours_End = String(d_End.getHours()).padStart(2, '0');
    const minutes_End = String(d_End.getMinutes()).padStart(2, '0');


    return `${day}/${month}/${year} - Início: ${hours_Start}:${minutes_Start}h - Fim: ${hours_End}:${minutes_End}h`;
}