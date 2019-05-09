// @flow
import React, { Fragment } from 'react';

import { DatePicker } from 'material-ui-pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';

import { Title, Text, Paper } from '../../../../components/common';
import { sendAlert } from '../../../../components/Alert';

import * as dorData from '../../../../data/dor';
import ResultPanel from './ResultPanel';
import { type SessionDor } from '../../../../data/dor/type';
import { Tooltip } from '@material-ui/core';

type Props = {
  selected: ?SessionDor,
  deselect: () => mixed,
  refreshTable: (id: ?number) => mixed,
};

type State = {
  sessionForm: any,
  create: boolean,
  showResults: boolean,
};

export default class SessionForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sessionForm: this.getDefaultForm(),
      create: false,
      showResults: false,
    };
  }

  componentWillReceiveProps(props: Props) {
    if (props.selected && props.selected !== this.state.sessionForm) {
      this.setState({ create: false, sessionForm: props.selected });
    }
  }

  handleCloseResultsPanel = () => {
    this.setState({ showResults: false });
  };

  changeForm = (name: string) => (date: Date) => {
    this.setState(state => ({
      sessionForm: {
        ...state.sessionForm,
        [name]: date,
      },
    }));
  };

  getDefaultForm = () => {
    return {
      result: null,
      firstTurn: null,
      secondTurn: null,
      enabled: false,
    };
  };

  createSession = async () => {
    const { sessionForm } = this.state;
    const res = await dorData.createSession({
      result: sessionForm.result,
      firstTurn: sessionForm.firstTurn,
      secondTurn: sessionForm.secondTurn,
    });
    this.setState({
      sessionForm: {
        result: null,
        firstTurn: null,
        secondTurn: null,
      },
      create: false,
    });
    this.props.refreshTable(res.data.id);
  };

  updateSession = async () => {
    const { sessionForm } = this.state;
    const { selected } = this.props;
    if (selected) {
      try {
        const res = await dorData.updateSession(selected.id, {
          result: sessionForm.result,
          firstTurn: sessionForm.firstTurn,
          secondTurn: sessionForm.secondTurn,
          enabled: sessionForm.enabled,
        });
        sendAlert('Session mise à jour');
        this.props.refreshTable(res.data.id);
      } catch (e) {
        sendAlert('Erreur lors de la mise à jour');
      }
    }
  };

  deleteSession = async () => {
    if (this.props.selected) {
      await dorData.deleteSession(this.props.selected.id);
      this.props.refreshTable();
      this.props.deselect();
    }
  };

  isCreateFormValid() {
    const { result, firstTurn, secondTurn } = this.state.sessionForm;
    return result != null && firstTurn != null && secondTurn != null;
  }

  saveSession = () => {
    if (this.state.create) {
      this.createSession();
      return;
    }
    this.updateSession();
  };

  genDiploma = async () => {
    const { selected } = this.props;
    if (selected) {
      await dorData.generateDiploma(selected.id);
    }
  };

  render() {
    const { sessionForm, create } = this.state;
    const { selected } = this.props;

    const firstTurnLimit = {};
    if (sessionForm.secondTurn) firstTurnLimit.maxDate = sessionForm.secondTurn;
    const secondTurnLimit = {};
    if (sessionForm.firstTurn) secondTurnLimit.minDate = sessionForm.firstTurn;
    if (sessionForm.result) secondTurnLimit.maxDate = sessionForm.result;
    const resultLimit = {};
    if (sessionForm.secondTurn)
      secondTurnLimit.minDate = sessionForm.secondTurn;

    return (
      <div>
        <Paper p="2em" style={{ marginBottom: 20 }}>
          <Title invert fontSize={1.2}>
            {create ? 'Créer une Session' : 'Session'}
          </Title>
          {(selected || create) && (
            <div>
              <DatePicker
                margin="normal"
                label="1er tour"
                value={sessionForm.firstTurn}
                onChange={this.changeForm('firstTurn')}
                format="DD/MM/YY"
                fullWidth
                {...firstTurnLimit}
              />
              <DatePicker
                margin="normal"
                label="2e tour"
                value={sessionForm.secondTurn}
                onChange={this.changeForm('secondTurn')}
                format="DD/MM/YY"
                fullWidth
                {...secondTurnLimit}
              />
              <DatePicker
                margin="normal"
                label="Résultats"
                minDate={sessionForm.secondTurn}
                value={sessionForm.result}
                onChange={this.changeForm('result')}
                format="DD/MM/YY"
                fullWidth
                {...resultLimit}
              />
              {!create && (
                <FormControlLabel
                  style={{ width: '100%' }}
                  control={
                    <Checkbox
                      checked={sessionForm.enabled}
                      onChange={(e, checked) =>
                        this.setState({
                          sessionForm: {
                            ...this.state.sessionForm,
                            enabled: checked,
                          },
                        })
                      }
                    />
                  }
                  label="Activé"
                />
              )}

              {create && (
                <Button
                  color="primary"
                  onClick={this.createSession}
                  disabled={!this.isCreateFormValid()}
                >
                  Créer
                </Button>
              )}
              {!create && (
                <Fragment>
                  <Button
                    color="primary"
                    onClick={this.saveSession}
                    disabled={!this.isCreateFormValid()}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => this.setState({ showResults: true })}
                  >
                    Résultats
                  </Button>
                </Fragment>
              )}
            </div>
          )}
          {!selected &&
            !create && (
              <div>
                <Text>Sélectionnez une session de la liste</Text>
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
              sessionForm: this.getDefaultForm(),
            });
          }}
        >
          <AddIcon />
        </Button>
        {selected && (
          <Fragment>
            <Tooltip placement="top" title="Supprimer la session">
              <Button
                variant="fab"
                size="medium"
                color="secondary"
                style={{ marginRight: 10 }}
                onClick={this.deleteSession}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>

            <Tooltip placement="top" title="Générer et envoyer les diplômes">
              <Button
                variant="fab"
                size="medium"
                color="secondary"
                onClick={this.genDiploma}
              >
                <SendIcon />
              </Button>
            </Tooltip>

            <ResultPanel
              selected={selected}
              open={this.state.showResults}
              handleClose={this.handleCloseResultsPanel}
              title="Résultat de session"
            />
          </Fragment>
        )}
      </div>
    );
  }
}
