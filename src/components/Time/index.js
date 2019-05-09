// @flow

import React from 'react';

import moment from 'moment';
import 'moment/locale/fr';

export default function Time(props: {
  date: number,
  format: string
}) {
  moment.locale('fr');

  const formatDate = (): string => {
    const { date, format } = props;
    let datetime = moment(date);
    return datetime.format(format);
  };
  const datetime = formatDate();

  return <time dateTime={datetime}>{datetime}</time>;
}
