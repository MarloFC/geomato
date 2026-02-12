import React, { useState } from 'react';
import styled from 'styled-components';
import { Package, ChevronDown, ChevronUp, Plus, Trash2, HardDrive } from 'lucide-react';
import MaterialForm from './MaterialForm';
import { Operation, Material } from '../types';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OperationCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #edf2f7;
`;

interface CardHeaderProps {
    isOpen: boolean;
}

const CardHeader = styled.div<CardHeaderProps>`
  padding: 16px 20px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: ${props => props.isOpen ? '1px solid #edf2f7' : 'none'};

  &:hover {
    background: #fdfdfd;
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #2d3748;
  }
`;

const Badge = styled.span`
  background: #f6fdf9;
  color: #008542;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid rgba(0, 133, 66, 0.2);
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CardContent = styled.div`
  padding: 20px;
  background: #ffffff;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f7fafc;
  border-radius: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span:first-child {
    font-size: 0.75rem;
    color: #a0aec0;
    font-weight: 600;
    text-transform: uppercase;
  }

  span:last-child {
    font-size: 0.9rem;
    color: #4a5568;
  }
`;

const MaterialsSection = styled.div`
  margin-top: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h4 {
    margin: 0;
    font-size: 1rem;
    color: #4a5568;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const AddButton = styled.button`
  background: transparent;
  color: #008542;
  border: 1px solid #008542;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #f6fdf9;
  }
`;

const MaterialTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 0.85rem;

  th {
    text-align: left;
    padding: 10px;
    background: #f8fafc;
    color: #718096;
    border-bottom: 2px solid #edf2f7;
  }

  td {
    padding: 10px;
    border-bottom: 1px solid #edf2f7;
    color: #4a5568;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  color: #e53e3e;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #fff5f5;
  }
`;

interface OperationListProps {
    operations: Operation[];
    onAddMaterialToOp: (opId: number, material: Material) => void;
    onDeleteMaterial: (opId: number, materialId: number) => void;
    onDeleteOperation: (opId: number) => void;
}

const OperationList: React.FC<OperationListProps> = ({ operations, onAddMaterialToOp, onDeleteMaterial, onDeleteOperation }) => {
    const [openCardId, setOpenCardId] = useState<number | null>(null);
    const [showAddMaterialId, setShowAddMaterialId] = useState<number | null>(null);

    const toggleCard = (id: number) => {
        setOpenCardId(openCardId === id ? null : id);
    };

    return (
        <ListContainer>
            {operations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                    Nenhuma operação criada ainda.
                </div>
            ) : (
                operations.map(op => (
                    <OperationCard key={op.id}>
                        <CardHeader isOpen={openCardId === op.id} onClick={() => toggleCard(op.id)}>
                            <CardTitle>
                                <Package size={20} color="#008542" />
                                <h3>{op.title}</h3>
                                <Badge>{op.embarcacao || 'N/A'}</Badge>
                            </CardTitle>
                            <CardActions>
                                <span style={{ fontSize: '0.85rem', color: '#718096' }}>
                                    {op.materials.length} materiais
                                </span>
                                <DeleteButton onClick={(e) => { e.stopPropagation(); onDeleteOperation(op.id); }}>
                                    <Trash2 size={18} />
                                </DeleteButton>
                                {openCardId === op.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </CardActions>
                        </CardHeader>

                        {openCardId === op.id && (
                            <CardContent>
                                <InfoGrid>
                                    <InfoItem>
                                        <span>Data</span>
                                        <span>{op.dataCarregamento || '-'}</span>
                                    </InfoItem>
                                    <InfoItem>
                                        <span>Coroa BE</span>
                                        <span>{op.coroaBE || '-'}</span>
                                    </InfoItem>
                                    <InfoItem>
                                        <span>Coroa BB</span>
                                        <span>{op.coroaBB || '-'}</span>
                                    </InfoItem>
                                    <InfoItem>
                                        <span>STO Resp</span>
                                        <span>{op.stoRespo || '-'}</span>
                                    </InfoItem>
                                    <InfoItem>
                                        <span>Apoio Resp</span>
                                        <span>{op.apoioRespo || '-'}</span>
                                    </InfoItem>
                                </InfoGrid>

                                {op.obsEmbarque && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#a0aec0', fontWeight: '600', textTransform: 'uppercase' }}>Obs Embarque</span>
                                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#4a5568' }}>{op.obsEmbarque}</p>
                                    </div>
                                )}

                                <MaterialsSection>
                                    <SectionHeader>
                                        <h4><HardDrive size={18} /> Materiais</h4>
                                        <AddButton onClick={() => setShowAddMaterialId(op.id)}>
                                            <Plus size={16} /> Adicionar
                                        </AddButton>
                                    </SectionHeader>

                                    {showAddMaterialId === op.id && (
                                        <MaterialForm
                                            onAddMaterial={(mat) => {
                                                onAddMaterialToOp(op.id, mat);
                                                setShowAddMaterialId(null);
                                            }}
                                            onCancel={() => setShowAddMaterialId(null)}
                                        />
                                    )}

                                    {op.materials.length > 0 ? (
                                        <MaterialTable>
                                            <thead>
                                                <tr>
                                                    <th>Material</th>
                                                    <th>Qtd</th>
                                                    <th>Armazenamento</th>
                                                    <th>Origem</th>
                                                    <th>Proprietário</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {op.materials.map(mat => (
                                                    <tr key={mat.id}>
                                                        <td>{mat.material}</td>
                                                        <td>{mat.quantidade}</td>
                                                        <td>{mat.armazenamento}</td>
                                                        <td>{mat.origem}</td>
                                                        <td>{mat.proprietario}</td>
                                                        <td>
                                                            <DeleteButton onClick={() => onDeleteMaterial(op.id, mat.id)}>
                                                                <Trash2 size={16} />
                                                            </DeleteButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </MaterialTable>
                                    ) : (
                                        !showAddMaterialId && <p style={{ fontSize: '0.85rem', color: '#a0aec0', margin: '10px 0' }}>Sem materiais cadastrados.</p>
                                    )}
                                </MaterialsSection>
                            </CardContent>
                        )}
                    </OperationCard>
                ))
            )}
        </ListContainer>
    );
};

export default OperationList;
