import { Input, InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Box, Flex } from '@rebass/grid';
import moment from 'moment';
import React from 'react';

interface TimeItem {
  value: number;
  name: number | string;
}

interface TimeSelectProps {
  onChange: (value: string) => void;
  label: string;
  value?: number;
  items: TimeItem[];
}

const TimeSelect: React.FC<TimeSelectProps> = props => {
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel htmlFor="input">{props.label}</InputLabel>
      <Select
        native
        value={props.value || 0}
        onChange={e => props.onChange(e.target.value as string)}
        input={<Input fullWidth id="input" />}
      >
        {props.items.map((item, id) => (
          <option key={id} value={item.value}>
            {item.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export interface DatePickerProps {
  date?: number;
  startYear?: number;
  endYear?: number;
  dateonly?: boolean;
  onChange: (newDate: Date) => void;
}

interface DatePickerState {
  hour: number;
  minute: number;
  day: number;
  month: number;
  year: number;
}

export default class DatePicker extends React.PureComponent<DatePickerProps> {
  state = {
    hour: 0,
    minute: 0,
    day: 0,
    month: 0,
    year: 0,
  };

  getDateComp(datetime: number) {
    const date = new Date(datetime);
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }

  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  buildHours = () => {
    let hours = [];
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  buildMinutes = () => {
    let minutes = [];
    for (var i = 0; i < 60; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  buildDays = () => {
    const { month, year } = this.state;
    let days = [];
    for (var i = 0; i < this.daysInMonth(month, year); i++) {
      days.push(i + 1);
    }
    return days;
  };

  buildMonths = () => {
    let months = [];
    for (var i = 0; i < 12; i++) {
      months.push(i);
    }
    return months;
  };

  buildYears = () => {
    let years = [];
    let startYear = this.props.startYear || 2000;
    let endYear = this.props.endYear || new Date().getFullYear() + 10;
    for (var i = startYear; i < endYear; i++) {
      years.push(i);
    }
    return years;
  };

  onChange = (name: keyof DatePickerState) => (value: string) => {
    if (this.props.date) {
      const dateComps = this.getDateComp(this.props.date);
      const { hour, minute, day, month, year } = {
        ...dateComps,
        [name]: parseInt(value, 10),
      } as DatePickerState;
      this.props.onChange(new Date(year, month, day, hour, minute));
    }
  };

  getMonthName = (month: number): string => {
    const date = new Date(0);
    date.setMonth(month);
    moment.locale('fr');
    return moment(date).format('MMMM');
  };

  render() {
    const hours = this.buildHours().map(e => ({ value: e, name: e }));
    const minutes = this.buildMinutes().map(e => ({ value: e, name: e }));
    const days = this.buildDays().map(e => ({ value: e, name: e }));
    const months = this.buildMonths().map(e => ({
      value: e,
      name: this.getMonthName(e),
    }));
    const years = this.buildYears().map(e => ({ value: e, name: e }));

    const { hour, minute, day, month, year } = this.getDateComp(
      this.props.date || Date.now()
    );

    const size = this.props.dateonly ? 3 : 5;

    return (
      <div>
        <Flex flexWrap="wrap">
          {!this.props.dateonly && (
            <Box p={1} width={[1 / 2, 1 / size]}>
              <TimeSelect
                label="Heure"
                value={hour}
                items={hours}
                onChange={this.onChange('hour')}
              />
            </Box>
          )}
          {!this.props.dateonly && (
            <Box p={1} width={[1 / 2, 1 / size]}>
              <TimeSelect
                label="Minute"
                value={minute}
                items={minutes}
                onChange={this.onChange('minute')}
              />
            </Box>
          )}
          <Box p={1} width={[1 / 3, 1 / size]}>
            <TimeSelect
              label="Jour"
              value={day}
              items={days}
              onChange={this.onChange('day')}
            />
          </Box>
          <Box p={1} width={[1 / 3, 1 / size]}>
            <TimeSelect
              label="Mois"
              value={month}
              items={months}
              onChange={this.onChange('month')}
            />
          </Box>
          <Box p={1} width={[1 / 3, 1 / size]}>
            <TimeSelect
              label="Année"
              value={year}
              items={years}
              onChange={this.onChange('year')}
            />
          </Box>
        </Flex>
      </div>
    );
  }
}
