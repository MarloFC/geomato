import { Operation, Material } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f6fdf9;
  background-image: 
    radial-gradient(at 0% 0%, hsla(150, 100%, 93%, 1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(48, 100%, 90%, 1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(150, 100%, 93%, 1) 0, transparent 50%);
  padding: 40px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #008542;
    font-weight: 800;
    letter-spacing: -0.025em;
  }
`;

const ExportButton = styled.button`
  background: #FFD100;
  color: #008542;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #f7cb00;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #2d3748;
  margin: 40px 0 20px 0;
  font-weight: 700;
`;

const App: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/operations`);
        if (!response.ok) throw new Error('Failed to fetch operations');
        const data = await response.json();
        setOperations(data);
      } catch (error) {
        console.error('Error fetching operations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperations();
  }, []);

  const addOperation = async (opData: Omit<Operation, 'id' | 'materials'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opData),
      });
      if (!response.ok) throw new Error('Failed to create operation');
      const newOp = await response.json();
      setOperations([newOp, ...operations]);
    } catch (error) {
      console.error('Error adding operation:', error);
    }
  };

  const addMaterialToOp = async (opId: number, material: Omit<Material, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/operations/${opId}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material),
      });
      if (!response.ok) throw new Error('Failed to add material');
      const newMaterial = await response.json();

      setOperations(operations.map(op => {
        if (op.id === opId) {
          return { ...op, materials: [...op.materials, newMaterial] };
        }
        return op;
      }));
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const deleteMaterial = async (opId: number, materialId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/operations/${opId}/materials/${materialId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete material');

      setOperations(operations.map(op => {
        if (op.id === opId) {
          return { ...op, materials: op.materials.filter(m => m.id !== materialId) };
        }
        return op;
      }));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const deleteOperation = async (opId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta operação?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/operations/${opId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete operation');
        setOperations(operations.filter(op => op.id !== opId));
      } catch (error) {
        console.error('Error deleting operation:', error);
      }
    }
  };

  const handleExport = () => {
    exportToExcel(operations);
  };

  return (
    <AppContainer>
      <Content>
        <Header>
          <Logo>
            <Ship size={32} color="#2b6cb0" />
            <h1>GeoMato Ops</h1>
          </Logo>
          <ExportButton
            onClick={handleExport}
            disabled={operations.length === 0}
          >
            <Download size={18} /> Exportar Excel (.xls)
          </ExportButton>
        </Header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
        ) : (
          <>
            <OperationForm onAddOperation={addOperation} />

            <SectionTitle>Plano de Operações</SectionTitle>
            <OperationList
              operations={operations}
              onAddMaterialToOp={addMaterialToOp}
              onDeleteMaterial={deleteMaterial}
              onDeleteOperation={deleteOperation}
            />
          </>
        )}
      </Content>
    </AppContainer>
  );
}

export default App;
