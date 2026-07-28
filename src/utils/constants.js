export const PHASES = {
  CARD_REVEAL: 'card_reveal',
  ROUND:       'round',
  RESULT:      'result',
};

export const getPhaseLabel = (phase) => {
  switch (phase) {
    case PHASES.CARD_REVEAL: return 'Distribuição de Cartões';
    case PHASES.ROUND:       return 'Rodada em Andamento';
    case PHASES.RESULT:      return 'Resultado';
    default: return 'Configuração';
  }
};
