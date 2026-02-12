export interface Material {
    id: number;
    material: string;
    quantidade: string | number;
    armazenamento: string;
    comprimento?: string | number;
    objetivo?: string;
    origem?: string;
    proprietario?: string;
    sequencia?: string | number;
}

export interface Operation {
    id: number;
    title: string;
    embarcacao: string;
    dataCarregamento: string;
    coroaBE: string;
    coroaBB: string;
    obsEmbarque: string;
    stoRespo: string;
    apoioRespo: string;
    materials: Material[];
}
