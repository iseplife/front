// @flow

import React from 'react';
import styled from 'styled-components';

const Style = styled.h3`
  font-weight: 500;
  font-size: ${props => props.fs || '1em'};
  color: ${props => props.theme[props.color] || props.color || 'white'};
  margin: ${props => props.m || '1em'};
`;

export default class CountDown extends React.Component {
  state = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  };

  componentDidMount() {
    const { date } = this.props;
    if (date - new Date().getTime() < 0) {
      this.setState({ isFinished: true });
      return;
    }

    this.timer = setInterval(() => {
      const diff = date - new Date().getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
    const indic = {
      fontSize: 12,
      textTransform: 'uppercase',
      marginRight: 5,
    };
    const { days, hours, minutes, seconds, isFinished } = this.state;
    return (
      <Style {...this.props}>
        {isFinished && this.props.endDisplay}
        {
          !isFinished &&
          <span>
            {days}<span style={indic}>J</span>
            {hours}<span style={indic}>H</span>
            {minutes}<span style={indic}>MIN</span>
            {seconds}<span style={indic}>S</span>
          </span>
        }
      </Style>
    );
  }
}
