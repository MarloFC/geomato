import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { Box, Save } from 'lucide-react';
import { Material } from '../types';

const FormContainer = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  border: 1px dashed #cbd5e0;
  margin-top: 15px;
`;

const Title = styled.h3`
  margin-top: 0;
  color: #2d3748;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.8rem;
  color: #718096;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: #008542;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.85rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #008542;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

interface ActionButtonProps {
    variant?: 'save' | 'cancel';
}

const ActionButton = styled.button<ActionButtonProps>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const SaveButton = styled(ActionButton)`
  background: #008542;
  color: white;
`;

const CancelButton = styled(ActionButton)`
  background: #edf2f7;
  color: #4a5568;
`;

interface MaterialFormProps {
    onAddMaterial: (material: Material) => void;
    onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ onAddMaterial, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Material, 'id'>>({
        material: '',
        quantidade: '',
        armazenamento: 'Materiais e Acessórios no Convés',
        comprimento: '',
        objetivo: '',
        origem: '',
        proprietario: '',
        sequencia: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.material || !formData.quantidade) return;

        onAddMaterial({
            ...formData,
            id: Date.now()
        } as Material);

        setFormData({
            material: '',
            quantidade: '',
            armazenamento: 'Materiais e Acessórios no Convés',
            comprimento: '',
            objetivo: '',
            origem: '',
            proprietario: '',
            sequencia: ''
        });
    };

    return (
        <FormContainer>
            <Title><Box size={18} color="#FFD100" /> Adicionar Material</Title>
            <form onSubmit={handleSubmit}>
                <Grid>
                    <FormGroup>
                        <Label>Descrição do Material</Label>
                        <Input
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            placeholder="Ex: Amarra 76mm"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Quantidade</Label>
                        <Input
                            type="number"
                            name="quantidade"
                            value={formData.quantidade}
                            onChange={handleChange}
                            placeholder="0"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Armazenamento</Label>
                        <Select
                            name="armazenamento"
                            value={formData.armazenamento}
                            onChange={handleChange}
                        >
                            <option value="Materiais e Acessórios no Convés">Convés</option>
                            <option value="Tanques">Tanques</option>
                            <option value="Caiçara">Caiçara</option>
                        </Select>
                    </FormGroup>
                    <FormGroup>
                        <Label>Comprimento (m)</Label>
                        <Input
                            type="number"
                            name="comprimento"
                            value={formData.comprimento}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Objetivo</Label>
                        <Input
                            name="objetivo"
                            value={formData.objetivo}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Origem</Label>
                        <Input
                            name="origem"
                            value={formData.origem}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Proprietário</Label>
                        <Input
                            name="proprietario"
                            value={formData.proprietario}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Sequência</Label>
                        <Input
                            type="number"
                            name="sequencia"
                            value={formData.sequencia}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </Grid>
                <ButtonGroup>
                    <SaveButton type="submit">
                        <Save size={16} /> Salvar Material
                    </SaveButton>
                    <CancelButton type="button" onClick={onCancel}>
                        Cancelar
                    </CancelButton>
                </ButtonGroup>
            </form>
        </FormContainer>
    );
};

export default MaterialForm;
