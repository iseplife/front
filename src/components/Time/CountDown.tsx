import React from 'react';
import styled, { StyledProps } from 'styled-components';

type StyleProps = StyledProps<{ fs?: string; color?: string; m?: string }>;
const Style = styled.h3`
  font-weight: 500;
  font-size: ${(props: StyleProps) => props.fs || '1em'};
  color: ${(props: StyleProps) =>
    props.theme[props.color as any] || props.color || 'white'};
  margin: ${(props: StyleProps) => props.m || '1em'};
`;

interface CountDownProps {
  date: number;
  fs?: string;
  endDisplay: React.ReactNode;
}

interface CountDownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

export default class CountDown extends React.Component<
  CountDownProps,
  CountDownState
> {
  state: CountDownState = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  };

  timer?: number;

  componentDidMount() {
    const { date } = this.props;
    if (date - new Date().getTime() < 0) {
      this.setState({ isFinished: true });
      return;
    }

    this.timer = window.setInterval(() => {
      const diff = date - new Date().getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        this.setState({ days, hours, minutes, seconds });
      } else {
        this.setState({ isFinished: true });
        clearInterval(this.timer);
      }
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { days, hours, minutes, seconds, isFinished } = this.state;

    const indic: React.CSSProperties = {
      fontSize: this.props.fs || 12,
      textTransform: 'uppercase',
      marginRight: 5,
    };
    return (
      <Style {...this.props}>
        {isFinished && this.props.endDisplay}
        {!isFinished && (
          <span>
            {days}
            <span style={indic}>J</span>
            {hours}
            <span style={indic}>H</span>
            {minutes}
            <span style={indic}>MIN</span>
            {seconds}
            <span style={indic}>S</span>
          </span>
        )}
      </Style>
    );
  }
}
