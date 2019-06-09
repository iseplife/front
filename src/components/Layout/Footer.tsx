import Button from '@material-ui/core/Button';
import { Box, Flex } from '@rebass/grid';
import { NavLinkAdapter } from 'components/utils';
import React from 'react';
import styled from 'styled-components';
import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';
import { FluidContent } from '../common';

const packageVersion = (require('../../../package.json') as any).version;

const version = `Version: ${packageVersion}`;

const SocialBox = styled.div`
  width: 100%;
  text-align: center;

  > h2 {
    margin: 0;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: white;
    font-size: 11px;
    font-weight: 500;
  }

  img {
    width: 100%;
  }

  img:hover {
    opacity: 0.5;
  }
`;

const LinksBar = styled.div`
  background: ${SECONDARY_COLOR};
  color: white;
  padding: 10px 0;
  font-weight: 500;

  > div {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 50px;
  }
`;

const Footer = styled.footer`
  background: ${MAIN_COLOR};
  padding: 20px;
  color: white;

  p,
  h4 {
    margin: 0;
    margin-bottom: 5px;
  }

  h4 {
    text-transform: uppercase;
  }
`;

export default class FooterView extends React.Component {
  render() {
    return (
      <div>
        <Footer>
          <FluidContent>
            <Flex flexWrap="wrap">
              <Box width={[1, 1, 2 / 6]} p={2}>
                <h4>CONTACT</h4>
                <p>28, rue Notre-Dame-des-Champs</p>
                <p>75 006 PARIS</p>
                <p>iseplive@gmail.com</p>
              </Box>
              <Box width={[1, 1, 2 / 6]} p={2}>
                <SocialBox>
                  <h2>Suivez-nous sur les réseaux de l'internet</h2>
                  <Flex alignItems="center" justifyContent="space-around">
                    <Box width={1 / 4} p={1}>
                      <a
                        href="https://www.facebook.com/IsepLive/?fref=ts"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/img/svg/facebook.svg" alt="Facebook logo" />
                      </a>
                    </Box>
                    <Box width={1 / 4} p={1}>
                      <a
                        href="https://www.instagram.com/iseplive/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/img/svg/instagram.svg"
                          alt="Instagram logo"
                        />
                      </a>
                    </Box>
                    <Box width={1 / 4} p={1}>
                      <a
                        href="https://www.snapchat.com/add/iseplive"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/img/svg/snapchat.svg" alt="Snapchat logo" />
                      </a>
                    </Box>
                  </Flex>
                </SocialBox>
              </Box>
              <Box width={[1, 1, 2 / 6]} p={2}>
                <SocialBox>
                  <h2>Partenaires</h2>
                  <Flex alignItems="center">
                    <Box width={1 / 3} p={1}>
                      <a
                        href="https://www.juniorisep.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/img/layout/juniorisep.png"
                          alt="Junior ISEP logo"
                        />
                      </a>
                    </Box>
                    <Box width={1 / 3} p={1}>
                      <a
                        href="https://www.bdedestiny.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/img/layout/destiny.png" alt="Destiny logo" />
                      </a>
                    </Box>
                    <Box width={1 / 3} p={1}>
                      <a
                        href="https://www.isep.fr/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src="/img/layout/isep.png" alt="Alten logo" />
                      </a>
                    </Box>
                  </Flex>
                </SocialBox>
              </Box>
              <Box width={1} p={2}>
                <SocialBox>
                  <h2>
                    Site Internet développé par Guillaume CARRE et Victor ELY
                  </h2>
                </SocialBox>
              </Box>
            </Flex>
          </FluidContent>
        </Footer>
        <LinksBar>
          <div>
            <span title={version}>© {new Date().getFullYear()} ISEPLive</span>
            <Button
              style={{ marginLeft: 10 }}
              component={NavLinkAdapter}
              to="/aide"
              activeStyle={{
                color: MAIN_COLOR,
              }}
            >
              Aide
            </Button>
            <Button
              component={NavLinkAdapter}
              to="/mentions-legales"
              activeStyle={{
                color: MAIN_COLOR,
              }}
            >
              Mentions Légales
            </Button>
            <Button
              component={NavLinkAdapter}
              to="/convention-utilisation"
              activeStyle={{
                color: MAIN_COLOR,
              }}
            >
              Convention d'utilisation
            </Button>
            <Button
              component={NavLinkAdapter}
              to="/contact"
              activeStyle={{
                color: MAIN_COLOR,
              }}
            >
              Contact
            </Button>
          </div>
        </LinksBar>
      </div>
    );
  }
}
