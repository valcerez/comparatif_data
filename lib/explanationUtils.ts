export function explainCorrelation(r: number, label1: string, label2: string): string {
  const rounded = r.toFixed(2);
  const absR = Math.abs(r);

  let base = `r = ${rounded} ➜ `;

  if (absR < 0.2) {
    base += "Aucune corrélation significative.";
  } else if (absR < 0.4) {
    base += "Corrélation faible.";
  } else if (absR < 0.6) {
    base += "Corrélation modérée.";
  } else if (absR < 0.8) {
    base += "Corrélation forte.";
  } else {
    base += "Corrélation très forte.";
  }

  const direction =
    r > 0
      ? `Quand ${label1} augmente, ${label2} a tendance à augmenter aussi.`
      : `Quand ${label1} augmente, ${label2} a tendance à diminuer.`;

  return `${base} ${direction}`;
}