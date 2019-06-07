import moment from 'moment';
import 'moment/locale/fr';
import React from 'react';

moment.locale('fr');
const formatDate = (date: number, format: string): string => {
  let datetime = moment(date);
  return datetime.format(format);
};

interface TimeProps {
  date: number;
  format: string;
}

const Time: React.FC<TimeProps> = props => {
  const datetime = formatDate(props.date, props.format);
  return <time dateTime={datetime}>{datetime}</time>;
};

export default Time;
