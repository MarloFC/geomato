import * as XLSX from 'xlsx';
import { Operation } from '../types';

export const exportToExcel = (operations: Operation[]) => {
    const flattenedData: any[] = [];

    operations.forEach((op) => {
        if (op.materials && op.materials.length > 0) {
            op.materials.forEach((mat) => {
                flattenedData.push({
                    'ID Operação': op.id,
                    'Título': op.title,
                    'Embarcação': op.embarcacao,
                    'Data Carregamento': op.dataCarregamento,
                    'Coroa BE': op.coroaBE,
                    'Coroa BB': op.coroaBB,
                    'Obs Embarque': op.obsEmbarque,
                    'STO Resp': op.stoRespo,
                    'Apoio Resp': op.apoioRespo,
                    'ID Material': mat.id,
                    'Material': mat.material,
                    'Quantidade': mat.quantidade,
                    'Armazenamento': mat.armazenamento,
                    'Comprimento (m)': mat.comprimento,
                    'Objetivo': mat.objetivo,
                    'Origem': mat.origem,
                    'Proprietário': mat.proprietario,
                    'Sequência': mat.sequencia,
                });
            });
        } else {
            // Just operation data if no materials
            flattenedData.push({
                'ID Operação': op.id,
                'Título': op.title,
                'Embarcação': op.embarcacao,
                'Data Carregamento': op.dataCarregamento,
                'Coroa BE': op.coroaBE,
                'Coroa BB': op.coroaBB,
                'Obs Embarque': op.obsEmbarque,
                'STO Resp': op.stoRespo,
                'Apoio Resp': op.apoioRespo,
                'ID Material': '-',
                'Material': '-',
                'Quantidade': '-',
                'Armazenamento': '-',
                'Comprimento (m)': '-',
                'Objetivo': '-',
                'Origem': '-',
                'Proprietário': '-',
                'Sequência': '-',
            });
        }
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Operações e Materiais");

    // Generate buffer and download
    XLSX.writeFile(workbook, `Export_Operacoes_${new Date().toISOString().split('T')[0]}.xlsx`);
};
