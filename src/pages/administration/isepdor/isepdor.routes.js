// @flow

import Session from './Session';
import Question from './Question';
import Events from './Events';
import Employee from './Employee';
import Diploma from './Diploma';

export const routes: {
  tabName: string,
  path: string,
  comp: any,
}[] = [
  {
    tabName: 'Sessions',
    path: '/session',
    comp: Session,
  },
  {
    tabName: 'Questions',
    path: '/question',
    comp: Question,
  },
  {
    tabName: 'Evènements',
    path: '/events',
    comp: Events,
  },
  {
    tabName: 'Employés',
    path: '/employee',
    comp: Employee,
  },
  {
    tabName: 'Diplome',
    path: '/diploma',
    comp: Diploma,
  },
];
