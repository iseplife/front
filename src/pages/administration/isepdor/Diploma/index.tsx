import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FontIcon from '@material-ui/icons/FormatSize';
import DiplomaIcon from '@material-ui/icons/InsertPhoto';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Image, Layer, Stage, Text } from 'react-konva';
import { sendAlert } from '../../../../components/Alert';
import * as cm from '../../../../components/common';
import { backUrl } from '../../../../config';
import * as dorData from '../../../../data/dor';

type Attr = {
  x: number;
  y: number;
  fontSize?: number;
};

type DiplomaState = {
  image: any;
  titre: string;
  name: string;
  birth: string;
  font: string;
  fontSize: number;
  attrTitre: Attr;
  attrName: Attr;
  attrBirth: Attr;
  diplomaImg: File | null;
  fontFile: File | null;
};

export default class Diploma extends React.Component<{}, DiplomaState> {
  state: DiplomaState = {
    image: null,
    titre: 'Question',
    name: 'Jean Dupont',
    birth: '10/02/2030',
    attrTitre: { x: 130, y: 292 },
    attrName: { x: 207, y: 316 },
    attrBirth: { x: 172, y: 351 },
    font: 'Arial',
    fontSize: 15,
    diplomaImg: null,
    fontFile: null,
  };

  componentDidMount() {
    this.loadImage();
    this.loadConfig();
  }

  async loadConfig() {
    const res = await dorData.getConfig();
    const conf = res.data;
    const toScale = (pos: Attr) => {
      pos.x = pos.x * 0.7;
      pos.y = pos.y * 0.7;
      return pos;
    };
    this.setState({
      attrTitre: toScale(conf.titre),
      attrName: toScale(conf.name),
      attrBirth: toScale(conf.birthdate),
      fontSize: conf.name.fontSize * 0.7,
    });
  }

  loadImage() {
    const image = new (window as any).Image();
    image.src =
      backUrl + '/storage/dor/config/diploma.png?t=' + new Date().getTime();
    image.onload = () => {
      // setState will redraw layer
      // because "image" property is changed
      this.setState({
        image: image,
      });
    };
  }

  updateConfig = async () => {
    const { attrTitre, attrName, attrBirth, fontSize } = this.state;
    const toScale = (pos: Attr) => {
      pos.x = pos.x / 0.7;
      pos.y = pos.y / 0.7;
      return pos;
    };
    try {
      await dorData.updateConfig({
        titre: {
          ...toScale(attrTitre),
          fontSize: fontSize / 0.7,
        },
        name: {
          ...toScale(attrName),
          fontSize: fontSize / 0.7,
        },
        birthdate: {
          ...toScale(attrBirth),
          fontSize: fontSize / 0.7,
        },
      });

      if (this.state.diplomaImg) {
        await dorData.updateDiploma(this.state.diplomaImg);
      }
      if (this.state.fontFile) {
        await dorData.updateDiplomaFont(this.state.fontFile);
      }
      sendAlert('Config mise à jour');
      this.loadImage();
    } catch (err) {
      sendAlert('Erreur de mise à jour', 'error');
    }
  };

  dragEnd = (e: any) => {
    const { x, y, name } = e.target.attrs;
    if (name === 'titre') {
      this.updatePos('attrTitre', { x, y });
    }
    if (name === 'name') {
      this.updatePos('attrName', { x, y });
    }
    if (name === 'birth') {
      this.updatePos('attrBirth', { x, y });
    }
  };

  updatePos(targetName: keyof DiplomaState, value: Attr) {
    this.setState({
      [targetName]: value,
    } as any);
  }

  onSelectFile = (name: keyof DiplomaState) => (files: FileList | null) => {
    if (files) {
      this.setState({
        [name]: files[0],
      } as any);
    }
  };

  render() {
    // if (!this.state.image) return null;
    const stageStyle = {
      overflow: 'hidden',
      height: 600,
    };
    const { attrTitre, attrName, attrBirth, fontFile, diplomaImg } = this.state;
    return (
      <Flex>
        <Box width={[1, 1 / 4]} p={3}>
          <Box mt="10px">
            <cm.Text fs="12px">
              Les 3 zones de texte suivantes sont déplaçable à droite
            </cm.Text>
          </Box>
          <TextField
            label="Titre"
            margin="normal"
            fullWidth
            value={this.state.titre}
            onChange={e => this.setState({ titre: e.target.value })}
          />
          <TextField
            label="Nom"
            margin="normal"
            fullWidth
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          <TextField
            label="Date de naissance"
            margin="normal"
            fullWidth
            value={this.state.birth}
            onChange={e => this.setState({ birth: e.target.value })}
          />
          <TextField
            label="Nom police"
            margin="normal"
            fullWidth
            value={this.state.font}
            onChange={e => this.setState({ font: e.target.value })}
          />
          <Box mb="10px">
            <cm.Text fs="12px">
              Les données précédentes sont factices et ne seront pas
              enregistrées, elles servent uniquement à aider au positionnement
              des zones de texte.
            </cm.Text>
          </Box>

          <TextField
            type="number"
            label="Taille de police"
            margin="normal"
            fullWidth
            value={this.state.fontSize}
            onChange={e =>
              this.setState({ fontSize: parseInt(e.target.value) })
            }
          />
          <Flex mb="20px">
            <Box mr="10px">
              <div>
                <Box>
                  <cm.FileUpload
                    onFile={this.onSelectFile('diplomaImg')}
                    accept={['png']}
                    btnProps={{
                      size: 'small',
                      color: 'primary',
                      variant: 'raised',
                    }}
                  >
                    <DiplomaIcon style={{ marginRight: 10 }} /> Diplôme
                  </cm.FileUpload>
                </Box>
                <Box>
                  <cm.Text fs="14px">{diplomaImg && diplomaImg.name}</cm.Text>
                </Box>
              </div>
            </Box>
            <Box>
              <div>
                <Box mb={2}>
                  <cm.FileUpload
                    onFile={this.onSelectFile('fontFile')}
                    accept={['ttf']}
                    btnProps={{
                      size: 'small',
                      color: 'primary',
                      variant: 'raised',
                    }}
                  >
                    <FontIcon style={{ marginRight: 10 }} /> Police
                  </cm.FileUpload>
                </Box>
                <Box>
                  <cm.Text fs="14px">{fontFile && fontFile.name}</cm.Text>
                </Box>
              </div>
            </Box>
          </Flex>
          <Button
            onClick={this.updateConfig}
            color="secondary"
            variant="raised"
          >
            Sauvegarder
          </Button>
        </Box>
        <Box width={[1, 3 / 4]} p={3}>
          <cm.Paper>
            <Stage style={stageStyle} width={window.innerWidth} height={900}>
              <Layer draggable>
                {this.state.image && (
                  <Image
                    width={0.7 * this.state.image.naturalWidth}
                    height={0.7 * this.state.image.naturalHeight}
                    image={this.state.image}
                  />
                )}
                <Text
                  x={attrTitre.x}
                  y={attrTitre.y}
                  name="titre"
                  text={this.state.titre}
                  draggable
                  onDragEnd={this.dragEnd}
                  fontFamily={this.state.font}
                  fontSize={this.state.fontSize}
                />
                <Text
                  x={attrName.x}
                  y={attrName.y}
                  name="name"
                  text={this.state.name}
                  draggable
                  onDragEnd={this.dragEnd}
                  fontFamily={this.state.font}
                  fontSize={this.state.fontSize}
                />
                <Text
                  x={attrBirth.x}
                  y={attrBirth.y}
                  name="birth"
                  text={this.state.birth}
                  draggable
                  onDragEnd={this.dragEnd}
                  fontFamily={this.state.font}
                  fontSize={this.state.fontSize}
                />
              </Layer>
            </Stage>
          </cm.Paper>
        </Box>
      </Flex>
    );
  }
}
