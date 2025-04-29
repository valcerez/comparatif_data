export const datasetLabels: Record<string, string> = {
    'PIB.csv': '💰 PIB par pays',
    'pop_totale.csv': '👥 Population totale',
    'conso_elec.csv': '⚡ Consommation d’électricité',
    'acces_enseignement.csv': '🎓 Accès à l’enseignement',
    'esperance_vie.csv': '❤️ Espérance de vie',
};

export function getLabelForDataset(filename: string): string {
    return datasetLabels[filename] || filename;
}