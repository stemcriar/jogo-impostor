export const PHASES = {
  SETUP: 'setup',
  CARD_REVEAL: 'card_reveal',
  ROUND: 'round',
  VOTING: 'voting',
  RESULT: 'result'
};

export const ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  DASHBOARD: 'dashboard'
};

export const RESULT_TYPES = {
  HUMANS_WIN: 'humans_win',
  MACHINE_WINS: 'machine_wins'
};

export const API_BASE = '/api';

export const getPhaseLabel = (phase) => {
  switch (phase) {
    case PHASES.SETUP: return 'Configuração';
    case PHASES.CARD_REVEAL: return 'Distribuição de Cartões';
    case PHASES.ROUND: return 'Rodada em Andamento';
    case PHASES.VOTING: return 'Votação';
    case PHASES.RESULT: return 'Resultado';
    default: return 'Desconhecida';
  }
};
