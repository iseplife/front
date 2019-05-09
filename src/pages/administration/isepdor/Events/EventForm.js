// @flow
import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { Title, Text, Paper } from '../../../../components/common';
import type { EventDor, EventDorCreate } from '../../../../data/dor/type';
import * as dorData from '../../../../data/dor';
import { sendAlert } from '../../../../components/Alert';

type State = {
  eventForm: EventDor,
  create: boolean,
};

type Props = {
  selected: ?EventDor,
  deselect: () => mixed,
  refreshTable: (id?: number) => mixed,
};

export default class EventForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      eventForm: this.getDefaultForm(),
      create: false,
    };
  }

  componentWillReceiveProps(props: Props) {
    if (props.selected && props.selected !== this.state.eventForm) {
      this.setState({ create: false, eventForm: props.selected });
    }
  }

  changeCheckBox = (name: string) => (e: any, checked: boolean) => {
    this.setState({
      eventForm: {
        ...this.state.eventForm,
        [name]: checked,
      },
    });
  };

  getDefaultForm = () => {
    return {
      id: 0,
      name: '',
      party: false,
    };
  };

  createForm = (form: EventDor): EventDorCreate => {
    return {
      name: form.name,
      party: form.party,
    };
  };

  createEvent = async () => {
    const { eventForm } = this.state;
    const res = await dorData.createEvent(this.createForm(eventForm));
    this.setState({
      create: false,
    });
    this.props.refreshTable(res.data.id);
  };

  updateEvent = async () => {
    const { eventForm } = this.state;
    if (this.props.selected) {
      const res = await dorData.updateEvent(
        this.props.selected.id,
        this.createForm(eventForm)
      );
      sendAlert('Evenement mis à jour');
      this.props.refreshTable(res.data.id);
    }
  };

  deleteEvent = async () => {
    if (this.props.selected) {
      await dorData.deleteEvent(this.props.selected.id);
      this.props.refreshTable();
      this.props.deselect();
    }
  };

  isCreateFormValid() {
    const { name } = this.state.eventForm;
    return name !== '';
  }

  saveEvent = () => {
    if (this.state.create) {
      this.createEvent();
      return;
    }
    this.updateEvent();
  };

  render() {
    const { eventForm, create } = this.state;
    const { selected } = this.props;
    return (
      <div>
        <Paper p="2em" style={{ marginBottom: 20 }}>
          <Title invert fontSize={1.2}>
            {create ? 'Créer un Evènement' : 'Evènement'}
          </Title>
          {(selected || create) && (
            <div>
              <TextField
                margin="normal"
                fullWidth
                label="Nom"
                value={eventForm.name}
                onChange={e =>
                  this.setState({
                    eventForm: {
                      ...this.state.eventForm,
                      name: e.target.value,
                    },
                  })
                }
                style={{ marginBottom: 20 }}
              />

              <FormControlLabel
                style={{ width: '100%' }}
                control={
                  <Checkbox
                    checked={eventForm.party}
                    onChange={(e, checked) =>
                      this.setState({
                        eventForm: {
                          ...this.state.eventForm,
                          party: checked,
                        },
                      })
                    }
                  />
                }
                label="Soirée"
              />

              {create && (
                <Button
                  color="primary"
                  onClick={this.createEvent}
                  disabled={!this.isCreateFormValid()}
                >
                  Créer
                </Button>
              )}
              {!create && (
                <Button
                  color="primary"
                  onClick={this.saveEvent}
                  disabled={!this.isCreateFormValid()}
                >
                  Enregistrer
                </Button>
              )}
            </div>
          )}
          {!selected &&
            !create && (
              <div>
                <Text>Sélectionnez un évènement de la liste</Text>
              </div>
            )}
        </Paper>
        <Button
          variant="fab"
          size="medium"
          color="primary"
          style={{ marginRight: 10 }}
          onClick={() => {
            this.props.deselect();
            this.setState({
              create: true,
              eventForm: this.getDefaultForm(),
            });
          }}
        >
          <AddIcon />
        </Button>
        {selected && (
          <Button
            variant="fab"
            size="medium"
            color="secondary"
            onClick={this.deleteEvent}
          >
            <DeleteIcon />
          </Button>
        )}
      </div>
    );
  }
}
