// @flow

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Box, Flex } from 'grid-styled';

import { Banner, Filler, FluidContent, Header } from 'components/common';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class Help extends Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Besoin d'aide ?</h1>
            <p>On vous dévoile tout !</p>
          </Banner>
        </Header>
        <FluidContent>
          <Flex align="center">
            <Box flex="0 0 auto" ml="auto">
              <ExpansionPanel
                expanded={expanded === 'panel1'}
                onChange={this.handleChange('panel1')}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    General settings
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    I am an expansion panel
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                    feugiat. Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === 'panel2'}
                onChange={this.handleChange('panel2')}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Users</Typography>
                  <Typography className={classes.secondaryHeading}>
                    You are currently not an owner
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Donec placerat, lectus sed mattis semper, neque lectus
                    feugiat lectus, varius pulvinar diam eros in elit.
                    Pellentesque convallis laoreet laoreet.
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === 'panel3'}
                onChange={this.handleChange('panel3')}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    Advanced settings
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    Filtering has been entirely disabled for whole web server
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography>
                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                    Integer sit amet egestas eros, vitae egestas augue. Duis vel
                    est augue.
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Box>
          </Flex>
        </FluidContent>
      </div>
    );
  }
}

Help.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Help);
