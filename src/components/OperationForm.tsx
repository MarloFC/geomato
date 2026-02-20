import React, { useState, ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';
import { PlusCircle } from 'lucide-react';
import { Operation } from '../types';

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Title = styled.h2`
  margin-top: 0;
  color: #008542;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.85rem;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #008542;
    box-shadow: 0 0 0 3px rgba(0, 133, 66, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #008542;
  }
`;

const SubmitButton = styled.button`
  background: #008542;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  transition: background 0.2s;

  &:hover {
    background: #006b35;
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

interface OperationFormProps {
    onAddOperation: (operation: Operation) => void;
}

const OperationForm: React.FC<OperationFormProps> = ({ onAddOperation }) => {
    const [formData, setFormData] = useState<Omit<Operation, 'id' | 'materials'>>({
        title: '',
        embarcacao: '',
        dataCarregamento: '',
        coroaBE: '',
        coroaBB: '',
        obsEmbarque: '',
        stoRespo: '',
        apoioRespo: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;

        onAddOperation(formData as any);

        setFormData({
            title: '',
            embarcacao: '',
            dataCarregamento: '',
            coroaBE: '',
            coroaBB: '',
            obsEmbarque: '',
            stoRespo: '',
            apoioRespo: ''
        });
    };

    return (
        <FormContainer>
            <Title><PlusCircle size={24} color="#FFD100" /> Nova Operação</Title>
            <form onSubmit={handleSubmit}>
                <Grid>
                    <FormGroup>
                        <Label>Título do Plano</Label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: P-52 Desembarque"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Embarcação</Label>
                        <Input
                            name="embarcacao"
                            value={formData.embarcacao}
                            onChange={handleChange}
                            placeholder="Nome da embarcação"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Data de Carregamento</Label>
                        <Input
                            type="date"
                            name="dataCarregamento"
                            value={formData.dataCarregamento}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Coroa Instalada BE</Label>
                        <Input
                            name="coroaBE"
                            value={formData.coroaBE}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Coroa Instalada BB</Label>
                        <Input
                            name="coroaBB"
                            value={formData.coroaBB}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>STO Responsável</Label>
                        <Input
                            name="stoRespo"
                            value={formData.stoRespo}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Apoio Responsável</Label>
                        <Input
                            name="apoioRespo"
                            value={formData.apoioRespo}
                            onChange={handleChange}
                        />
                    </FormGroup>
                </Grid>
                <FormGroup style={{ marginTop: '16px' }}>
                    <Label>Observações de Embarque</Label>
                    <TextArea
                        name="obsEmbarque"
                        value={formData.obsEmbarque}
                        onChange={handleChange}
                    />
                </FormGroup>
                <SubmitButton type="submit">
                    Criar Operação
                </SubmitButton>
            </form>
        </FormContainer>
    );
};

export default OperationForm;
