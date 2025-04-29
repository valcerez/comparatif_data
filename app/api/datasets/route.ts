import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const datasetsDir = path.join(process.cwd(), 'public/datasets');
        const files = fs.readdirSync(datasetsDir);
        const csvFiles = files.filter(file => file.endsWith('.csv'));
        return NextResponse.json(csvFiles);
    } catch (error) {
        console.error('Erreur dans l’API datasets :', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}