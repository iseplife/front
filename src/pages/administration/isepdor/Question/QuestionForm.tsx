import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { sendAlert } from '../../../../components/Alert';
import { Paper, Text, Title } from '../../../../components/common';
import * as dorData from '../../../../data/dor';
import { QuestionDor, QuestionDorCreate } from '../../../../data/dor/type';

type CheckBoxAnswerProps = {
  enabled: boolean;
  label: string;
  onChange: (e: any, checked: boolean) => void;
};
const CheckBoxAnswer: React.FC<CheckBoxAnswerProps> = props => (
  <FormControlLabel
    style={{ width: '100%' }}
    control={<Checkbox checked={props.enabled} onChange={props.onChange} />}
    label={props.label}
  />
);

type QuestionFormState = {
  questionForm: QuestionDor;
  create: boolean;
};

type QuestionFormProps = {
  selected: QuestionDor | null;
  deselect: () => void;
  refreshTable: (id?: number) => void;
};

export default class QuestionForm extends React.Component<
  QuestionFormProps,
  QuestionFormState
> {
  constructor(props: QuestionFormProps) {
    super(props);
    this.state = {
      questionForm: this.getDefaultForm(),
      create: false,
    };
  }

  componentWillReceiveProps(props: QuestionFormProps) {
    if (props.selected && props.selected !== this.state.questionForm) {
      this.setState({ create: false, questionForm: props.selected });
    }
  }

  changeCheckBox = (name: string) => (e: any, checked: boolean) => {
    this.setState({
      questionForm: {
        ...this.state.questionForm,
        [name]: checked,
      },
    });
  };

  getDefaultForm = () => {
    return {
      id: 0,
      position: 0,
      title: '',
      enableClub: false,
      enableStudent: false,
      enableEmployee: false,
      enableEvent: false,
      enableParty: false,
      enablePromo: false,
      promo: 2000,
    };
  };

  createForm = (form: QuestionDor): QuestionDorCreate => {
    return {
      title: form.title,
      position: form.position,
      enableClub: form.enableClub,
      enableStudent: form.enableStudent,
      enableEmployee: form.enableEmployee,
      enableEvent: form.enableEvent,
      enableParty: form.enableParty,
      enablePromo: form.enablePromo,
      promo: form.promo,
    };
  };

  createQuestion = async () => {
    const { questionForm } = this.state;
    const res = await dorData.createQuestion(this.createForm(questionForm));
    this.setState({
      create: false,
    });
    this.props.refreshTable(res.data.id);
  };

  updateQuestion = async () => {
    const { questionForm } = this.state;
    if (this.props.selected) {
      const res = await dorData.updateQuestion(
        this.props.selected.id,
        this.createForm(questionForm)
      );
      sendAlert('Question mise à jour');
      this.props.refreshTable(res.data.id);
    }
  };

  deleteQuestion = async () => {
    if (this.props.selected) {
      await dorData.deleteQuestion(this.props.selected.id);
      this.props.refreshTable();
      this.props.deselect();
    }
  };

  isCreateFormValid() {
    const { title } = this.state.questionForm;
    return title !== '';
  }

  saveQuestion = () => {
    if (this.state.create) {
      this.createQuestion();
      return;
    }
    this.updateQuestion();
  };

  render() {
    const { questionForm, create } = this.state;
    const { selected } = this.props;
    return (
      <div>
        <Paper p="2em" style={{ marginBottom: 20 }}>
          <Title invert fontSize={1.2}>
            {create ? 'Créer une Question' : 'Question'}
          </Title>
          {(selected || create) && (
            <div>
              <TextField
                margin="normal"
                fullWidth
                label="Titre"
                value={questionForm.title}
                onChange={e =>
                  this.setState({
                    questionForm: {
                      ...this.state.questionForm,
                      title: e.target.value,
                    },
                  })
                }
                style={{ marginBottom: 20 }}
              />

              {selected && (
                <TextField
                  margin="normal"
                  fullWidth
                  type="number"
                  label="Position"
                  inputProps={{ min: 1 }}
                  value={questionForm.position}
                  onChange={e =>
                    this.setState({
                      questionForm: {
                        ...this.state.questionForm,
                        position: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  style={{ marginBottom: 20 }}
                />
              )}

              <Text mb={0.8}>Réponses possibles</Text>
              <CheckBoxAnswer
                label="Evènement"
                enabled={questionForm.enableEvent}
                onChange={this.changeCheckBox('enableEvent')}
              />
              <CheckBoxAnswer
                label="Soirée"
                enabled={questionForm.enableParty}
                onChange={this.changeCheckBox('enableParty')}
              />
              <CheckBoxAnswer
                label="Association"
                enabled={questionForm.enableClub}
                onChange={this.changeCheckBox('enableClub')}
              />
              <CheckBoxAnswer
                label="Elève"
                enabled={questionForm.enableStudent}
                onChange={this.changeCheckBox('enableStudent')}
              />
              <CheckBoxAnswer
                label="Employé"
                enabled={questionForm.enableEmployee}
                onChange={this.changeCheckBox('enableEmployee')}
              />

              {!create && (
                <div>
                  <Text mb={0.8}>Promo</Text>
                  <CheckBoxAnswer
                    label="Filtrer par promo"
                    enabled={questionForm.enablePromo}
                    onChange={this.changeCheckBox('enablePromo')}
                  />
                  {questionForm.enablePromo && (
                    <TextField
                      type="number"
                      margin="normal"
                      fullWidth
                      value={questionForm.promo}
                      onChange={e =>
                        this.setState({
                          questionForm: {
                            ...this.state.questionForm,
                            promo: parseInt(e.target.value, 10),
                          },
                        })
                      }
                      inputProps={{ min: 2000 }}
                      label="Promo"
                    />
                  )}
                </div>
              )}

              {create && (
                <Button
                  color="primary"
                  onClick={this.createQuestion}
                  disabled={!this.isCreateFormValid()}
                >
                  Créer
                </Button>
              )}
              {!create && (
                <Button
                  color="primary"
                  onClick={this.saveQuestion}
                  disabled={!this.isCreateFormValid()}
                >
                  Enregistrer
                </Button>
              )}
            </div>
          )}
          {!selected && !create && (
            <div>
              <Text>Sélectionnez une question de la liste</Text>
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
              questionForm: this.getDefaultForm(),
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
            onClick={this.deleteQuestion}
          >
            <DeleteIcon />
          </Button>
        )}
      </div>
    );
  }
}
