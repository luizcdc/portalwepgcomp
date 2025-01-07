import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

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

export const formatDateEvent = (dateStart: string | undefined, dateEnd: string | undefined): string => {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];

  const d_Start = dayjs(dateStart).add(1, "day");
  const d_end = dayjs(dateEnd);

  const startDate = d_Start.format('DD');
  const endDate = d_end.format('DD');
  const startMonth = d_Start.format('MM');
  const endMonth = d_end.format('MM');
  const year = d_end.format('YYYY');

 

  if (startMonth == endMonth) {
    return `${startDate} a ${endDate} de ${meses[parseInt(startMonth)-1 ]} de ${year}`;
  }
  return `${startDate} de ${meses[parseInt(startMonth)-1]} a ${endDate} de ${meses[parseInt(endMonth)-1]} de ${year}`;
};

export const formatDateUniq = (date: string | undefined): string => {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];

  const date_formated = dayjs(date);

  const day = date_formated.format('DD');
  const month = date_formated.format('MM');
  const year = date_formated.format('YYYY');

  return `${day} de ${meses[parseInt(month)-1]} de ${year}`;
};
