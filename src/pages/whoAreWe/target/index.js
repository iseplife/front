// @flow

import React, { Component } from 'react';

import { FluidContent, ScrollToTopOnMount } from 'components/common';

import Paper from '@material-ui/core/Paper';

import { Box, Flex } from 'grid-styled';

import styled from 'styled-components';

const Text = styled.p`
  text-align: justify;
`;

class Target extends Component {
  render() {
    return (
      <div>
        <ScrollToTopOnMount />
        <FluidContent style={{textAlign: 'center'}}>
          <h1 style={{color: '#ffc000'}}>Nos objectifs</h1>
          <Flex flexWrap="wrap">
            <Box w={[1, 1 / 3]} p={2}>
              <Paper elevation={4} style={{padding: 20}}>
                <img src="/img/target/communication.png" alt="" />
                <h4>Objectif 1</h4>
                <Text>C’est notre raison d’être !<br />Si vous voulez tout savoir sur la vie étudiante isépienne, les soirées, évènements, les sports, les échecs, la pétanque […], nous nous ferons un plaisir de vous le communiquer. Nous sommes également là pour aider l’ISEP et toutes ses associations à augmenter leur visibilité et d’améliorer leur image (création des affiches, vidéos promotionnelles, Photoshop, conseils en communication).</Text>
              </Paper>
            </Box>
            <Box w={[1, 1 / 3]} p={2}>
              <Paper elevation={4} style={{padding: 20}}>
                <img src="/img/target/photo-video.png" alt="" />
                <h4>Objectif 2</h4>
                <Text>Pour faire simple, on immortalise tout. Retrouvez sur notre site les photos de tous les évènements, soirées, WEI, semaine au ski, match de foot, et on en passe. Nos monteurs et photographes sont là pour vous faire revivre les grosses ambiances de votre passage parmi nous. De plus, nous sommes toujours disponibles pour réaliser quelques court-métrages / shooting promotionnels digne des plus grandes propagandes nord-coréennes !</Text>
              </Paper>
            </Box>
            <Box w={[1, 1 / 3]} p={2}>
              <Paper elevation={4} style={{padding: 20}}>
                <img src="/img/target/gazette.png" alt="" />
                <h4>Objectif 3</h4>
                <Text>On aiguise nos plus belles plumes à l’occasion des WEI, semaine au ski ou encore la campagne BDE. Parce qu’il est malheureusement impossible d’avoir des images sur tout ce qu’il se passe à chaque évènement (ce serait creepy autrement), nos rédacteurs se font une joie de vous maintenir informés de la façon la plus objective, professionnelle, et respectueuse possible.</Text>
              </Paper>
            </Box>
            <Box w={[1, 1 / 2]} p={2}>
              <Paper elevation={4} style={{padding: 20}}>
                <img src="/img/target/activite.png" alt="" />
                <h4>Objectif 4</h4>
                <Text>« Il n’y a pas de dossiers sans soirées ». Egalement là pour organiser des évènements ou des activités lors des WEI, semaine au ski et campagne BDE et se marrer un peu !</Text>
              </Paper>
            </Box>
            <Box w={[1, 1 / 2]} p={2}>
              <Paper elevation={4} style={{padding: 20}}>
                <img src="/img/target/loi.png" alt="" />
                <h4>Objectif 5</h4>
                <Text>Parce que l’éthique fait partie de nos attributions, nous nous assurons de respecter le cadre légal, notre administration, l’image de l’école, la condition humaine et morale, le droit à la diffusion et la liberté d’expression. Nous nous gardons de faire l’apologie de l’alcool, la drogue, le sex, le vice en tout genre, le bizutage, le harcèlement moral et physique, l’acharnement collectif, la dégradation volontaire de l’image d’une personne ou d’une entité, et de l’Olympique de Marseille.</Text>
              </Paper>
            </Box>
          </Flex>
        </FluidContent>
      </div>
    );
  }
}

export default Target;
