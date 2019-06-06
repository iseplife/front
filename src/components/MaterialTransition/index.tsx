import { Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import React from 'react';

export const SlideTransition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);
