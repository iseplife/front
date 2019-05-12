import Paper from '@material-ui/core/Paper';
import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  BgImageProfileStyle,
  FluidContent,
  ScrollToTopOnMount,
  Title,
} from '../../../components/common';

const BgImageStyle = styled.div`
  > img {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    margin-left: auto;
    min-height: 200px;
  }
`;

const PersonStyle = styled.div`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  > div {
    padding: 10px;
    color: ${props => props.theme.main};
  }

  > div p {
    margin: 0;
  }

  > div p.name {
    font-weight: 500;
    margin-bottom: 5px;
  }
`;

type PersonProps = {
  url: string;
  name: string;
  role: string;
  promotion: string;
};
const Person: React.FC<PersonProps> = props => {
  return (
    <PersonStyle>
      <BgImageProfileStyle alt="" src={props.url} w="100%" mh="200px" />{' '}
      <div>
        <p className="name">{props.name}</p>
        <p>{props.role}</p>
        <p>{props.promotion}</p>
      </div>
    </PersonStyle>
  );
};

class HallOfFame extends Component {
  render() {
    return (
      <div>
        <ScrollToTopOnMount />
        <FluidContent style={{ textAlign: 'center' }}>
          <div>
            <Title>Hall of Fame</Title>
          </div>
          <Title fontSize={1.3} invert>
            Tous les héros ne portent pas de capes
          </Title>

          <Flex flexWrap="wrap" alignItems="center">
            <Box p={2} width={[1, 1 / 4]}>
              <BgImageStyle>
                <img alt="raptor-jesus" src="/img/alloffame/RaptorJesus.jpg" />
              </BgImageStyle>
            </Box>
            <Box p={2} width={[1, 3 / 4]}>
              <Paper
                elevation={4}
                style={{
                  padding: 20,
                  borderRadius: '10px',
                }}
              >
                <h3>Dieu - 2006</h3>
                <p>
                  Créée ISEPLive le 1 juin 2006 à la suite de l'annonce du
                  ministre chinois de la culture Sun Jiazheng : le gouvernement
                  chinois a décidé la création de la"journée du Partimoine
                  culturel" en Chine, qui sera célébrée chaque année le deuxième
                  samedi du mois de juin.
                </p>
              </Paper>
            </Box>
            <Box p={2} width={[1, 3 / 4]}>
              <Paper
                elevation={4}
                style={{
                  padding: 20,
                  borderRadius: '10px',
                }}
              >
                <h3>Chaos - 2006 / 2012</h3>
                <p>Nous avons été un peu long au démarrage.</p>
              </Paper>
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <BgImageStyle>
                <img alt="nahed" src="/img/alloffame/nahed.jpg" />
              </BgImageStyle>
            </Box>
          </Flex>
          <Title invert>Les dictateurs</Title>
          <Flex flexWrap="wrap">
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/nahed.jpg"
                name="Yann Nahed"
                role="Président"
                promotion="2013 / 2014"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/cuver.jpg"
                name="Martin De Cuverville"
                role="Président"
                promotion="2014"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/danny.jpg"
                name="Danny Canaan"
                role="Président"
                promotion="2014 / 2015"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/raph.jpg"
                name="Raphael Lefebure"
                role="Vice-Président"
                promotion="2014 / 2015"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/pontier.jpg"
                name="Aurélien Pontier"
                role="Président"
                promotion="2015 / 2016"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/ratel.jpg"
                name="Antoine Ratel"
                role="Vice-Président"
                promotion="2015 / 2016"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/bado.jpg"
                name="Lucas Bado"
                role="Président"
                promotion="2016 / 2018"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/darny.jpg"
                name="Olivier Darny"
                role="Vice-Président"
                promotion="2016 / 2017"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/quillet.jpg"
                name="Sébastien Quillet"
                role="Vice-Président"
                promotion="2017 / 2018"
              />
            </Box>
          </Flex>
          <Title invert>Les rambos</Title>
          <Flex flexWrap="wrap">
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/mathu.jpg"
                name="Mathurin Desplats"
                role="SecGen / Respo montage"
                promotion="2014 / 2016"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/desmalades.jpg"
                name="Charles Desmalades"
                role="Respo montage"
                promotion="2015 / 2016"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/hugo.jpg"
                name="Hugo Nicolas"
                role="SecGen / Respo montage"
                promotion="2015 / 2017"
              />
            </Box>
            <Box p={2} width={[1, 1 / 4]}>
              <Person
                url="/img/alloffame/sauvage.jpg"
                name="Pierre Sauvage"
                role="SecGen"
                promotion="2016 / 2018"
              />
            </Box>
          </Flex>
        </FluidContent>
      </div>
    );
  }
}

export default HallOfFame;
