// @flow

import React, { Component } from 'react';

import { Banner, Filler, FluidContent, Header } from 'components/common';

class LegalNotice extends Component {
  render() {
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Mentions légales</h1>
            <p>On vous dévoile tout !</p>
          </Banner>
        </Header>
        <FluidContent>
          <p>Le site Iseplive.fr est une publication de la junior entreprise de l'ISEP, Junior ISEP.</p>
          <p>ISEPLive est une association loi 1901 créée le jeudi 1er Juin 2006.</p>
          <p>ISEPLive est responsable de tous les vecteurs de communication inter-élèves de l'ISEP : affiches, sites web des associations, journal de l'école, podcast, reportages photos, vidéos...</p>
          <p>ISEPLive a pour mission de fournir aux isépiens un flux continu d'informations sur la vie de l'école, et d'apporter une couverture médiatique à tous les évenements : soirées, WEI, sport...</p>
          <p><strong>Siège social : </strong>28, rue Notre-Dame-des-Champs 75006 PARIS - FRANCE (iseplive@gmail.com)</p>
          <p>L'association ISEPLive est soumise au droit français.</p>
        </FluidContent>
      </div>
    );
  }
}

export default LegalNotice;
