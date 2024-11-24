import dayjs from "dayjs";

export const formatDate = (dateStart: string): string => {
    const d_Start = dayjs(dateStart);
  
    const formattedDate = d_Start.format('DD/MM/YYYY');
    const startTime = d_Start.format('HH:mm');
 
  
    return `${formattedDate} - Início: ${startTime}h`;
  };

export const getDurationInMinutes = (dateStart: string, dateEnd: string) => {

    const d_inicio = dayjs(dateStart);
    const d_final = dayjs(dateEnd);

    return d_final.diff(d_inicio, "minute");
}