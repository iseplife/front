import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import FileUpload from '@material-ui/icons/CloudUpload';
import Done from '@material-ui/icons/Done';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { sendAlert } from '../../../components/Alert';
import { FluidContent, Paper, Text, Title } from '../../../components/common';
import * as studentData from '../../../data/users/student';

type ImportStudent = {
  firstname: string;
  lastname: string;
  studentid: string;
  promo: string;
};

type ImportStudentsProps = {};
type ImportStudentsState = {
  csv: File | null;
  photos: File[];
  progress: number;
  uploading: boolean;
  students: ImportStudent[];
  photosData: { [key: string]: string };
  uploadState: 'buffer' | 'query' | 'determinate' | 'indeterminate';
  page: number;
  result: any | null;
};

export default class ImportStudents extends React.Component<
  ImportStudentsProps,
  ImportStudentsState
> {
  state: ImportStudentsState = {
    csv: null,
    photos: [],
    progress: 0,
    uploading: false,
    students: [],
    photosData: {},
    uploadState: 'determinate',
    page: 0,
    result: null,
  };

  importStudents = async () => {
    const { csv, photos } = this.state;
    if (csv) {
      this.setState({ uploading: true });
      try {
        const res = await studentData.importStudents(csv, photos, progress => {
          let percentCompleted = Math.floor(
            (progress.loaded * 100) / progress.total
          );
          this.setState({
            progress: percentCompleted,
            uploadState:
              progress.loaded === progress.total
                ? 'indeterminate'
                : 'determinate',
          });
        });
        sendAlert('Users imported');
        this.setState({
          result: res.data,
          uploading: false,
          progress: 0,
          csv: null,
          photos: [],
          photosData: {},
          students: [],
        });
      } catch (err) {
        if (err.response) {
          sendAlert("Erreur lors de l'import");
          this.setState({
            uploading: false,
            progress: 0,
            csv: null,
            photos: [],
            photosData: {},
            students: [],
          });
        }
      }
    }
  };

  addCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      let csv = files[0];
      e.target.files = null;

      let reader = new FileReader();
      reader.onload = (fileReaderEvent: ProgressEvent) => {
        let text = reader.result as string;
        let students: ImportStudent[] = [];
        let csvParsed = text
          .split('\n')
          .filter(l => l !== '')
          .map(l => l.split(','));
        csvParsed.forEach((l, i) => {
          if (i !== 0) {
            students.push({
              firstname: l[0],
              lastname: l[1],
              studentid: l[2],
              promo: l[3],
            });
          }
        });
        this.setState({ students });
      };
      reader.readAsText(csv);

      this.setState({ csv, result: null });
    }
  };

  importPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      let photos = Array.from(files);
      e.target.files = null;
      const readerPromise = (
        file: File
      ): Promise<{ url: string; file: File }> =>
        new Promise(resolve => {
          let reader = new FileReader();
          reader.onload = e => resolve({ url: reader.result as string, file });
          reader.readAsDataURL(file);
        });

      const tmpUrls = photos.map(photo => readerPromise(photo));

      const photosData = {} as { [key: string]: string };
      const res = await Promise.all(tmpUrls);
      res.forEach(data => {
        const fileName = data.file.name;
        const parts = fileName.split('.');
        if (parts.length > 0) {
          const name = parts[0];
          photosData[name] = data.url;
        }
      });

      this.setState({ photosData, photos, result: null });
    }
  };

  handleChangePage = (e: any, page: number) => {
    this.setState({ page });
  };

  render() {
    const discList = {
      listStyle: 'disc',
    };

    const {
      uploading,
      progress,
      csv,
      photos,
      students,
      page,
      photosData,
      uploadState,
      result,
    } = this.state;
    return (
      <FluidContent>
        <Title invert>Import Élèves</Title>
        <Paper p="2em">
          <Flex>
            <Box mr={2} mb={2}>
              <input
                id="csvFile"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={this.addCsv}
              />
              <label htmlFor="csvFile">
                <Button component="span" variant="contained" color="primary">
                  <FileUpload style={{ marginRight: 5 }} /> CSV Eleves
                </Button>
              </label>
            </Box>
            <Box>
              <input
                id="photos"
                type="file"
                multiple
                accept=".jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={this.importPhoto}
              />
              <label htmlFor="photos">
                <Button component="span" variant="contained" color="primary">
                  <FileUpload style={{ marginRight: 5 }} /> Photos
                </Button>
              </label>
            </Box>
          </Flex>

          <Box mb={2}>
            {csv && (
              <Text>
                CSV élèves: {csv.name} - {students.length} élèves à importer
              </Text>
            )}
            {photos.length !== 0 && (
              <Text>
                {photos.length} photo
                {photos.length !== 1 && 's'} sélectionnée
                {photos.length !== 1 && 's'}
              </Text>
            )}
          </Box>
          <Box mb={1}>
            {uploading && (
              <LinearProgress variant={uploadState} value={progress} />
            )}
          </Box>
          <Box mb={1}>
            <Button
              disabled={uploading || !csv || photos.length === 0}
              variant="contained"
              color="secondary"
              onClick={this.importStudents}
            >
              <Done style={{ marginRight: 5 }} /> Importer
            </Button>
          </Box>
          {result && (
            <Text>
              <span>Résultats</span>
              <ul>
                <li style={discList}>
                  {result.imported}/{result.studentsSent} étudiants importés
                </li>
                <li style={discList}>
                  {result.photoAdded}/{result.photosSent} photos ajoutées
                </li>
                <li style={discList}>
                  {result.alreadyImported}/{result.studentsSent} étudiants déjà
                  existants
                </li>
                <li style={discList}>
                  {result.studentAndPhotoNotMatched} photos non associées à un
                  étudiant
                </li>
              </ul>
            </Text>
          )}
          {csv && (
            <Table>
              <TableHead>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[20]}
                    count={students.length}
                    rowsPerPage={20}
                    page={page}
                    onChangePage={this.handleChangePage}
                  />
                </TableRow>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Promotion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.slice(page * 20, page * 20 + 20).map(s => {
                  return (
                    <TableRow key={s.studentid}>
                      <TableCell>
                        <img
                          alt="student"
                          src={photosData[s.studentid]}
                          style={{ width: '50px' }}
                        />
                      </TableCell>
                      <TableCell>
                        {s.firstname} {s.lastname}
                      </TableCell>
                      <TableCell>{s.promo}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[20]}
                    count={students.length}
                    rowsPerPage={20}
                    page={page}
                    onChangePage={this.handleChangePage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </Paper>
      </FluidContent>
    );
  }
}
