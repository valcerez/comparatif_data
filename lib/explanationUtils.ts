export function explainCorrelation(r: number): string {
  const absR = Math.abs(r);

  if (r === 0) {
    return "Il n'y a aucune corrélation entre les deux variables.";
  } else if (absR < 0.3) {
    return "La corrélation est très faible. Les variables semblent indépendantes.";
  } else if (absR < 0.6) {
    return `Corrélation modérée${r > 0 ? ' : elles ont tendance à évoluer ensemble.' : ' : quand l’une augmente, l’autre diminue légèrement.'}`;
  } else if (absR < 0.9) {
    return `Corrélation forte${r > 0 ? ' : les deux variables évoluent dans le même sens.' : ' : elles évoluent souvent en sens inverse.'}`;
  } else {
    return `Corrélation très forte${r > 0 ? ' : les variables sont quasiment liées de manière linéaire.' : ' : forte opposition systématique entre les deux.'}`;
  }
}