import PropTypes from 'prop-types';

const FieldsetDeploymentEnvironment = ({formData, onChange, readOnly})=>{

    return (
        <fieldset>
            <legend>Ambiente de implementação</legend>
            <div>
                <label htmlFor="developmentEnvironment">Ambiente de desenvolvimento</label>
                <select 
                    name="developmentEnvironment" 
                    id="developmentEnvironment"
                    value={formData.developmentEnvironment}
                    onChange={onChange}
                    disabled={readOnly}
                    >
                    <option value="">Selecione uma opção</option>
                    <option value="implementado">Implementado</option>
                    <option value="planejado">Em andamento/Planejado</option>
                </select>
            </div>
            <div>
                <label htmlFor="approvalEnvironment">Ambiente de homologação</label>
                <select 
                    name="approvalEnvironment" 
                    id="approvalEnvironment"
                    value={formData.approvalEnvironment}
                    onChange={onChange}
                    disabled={readOnly}
                    >
                    <option value="">Selecione uma opção</option>
                    <option value="implementado">Implementado</option>
                    <option value="planejado">Em andamento/Planejado</option>
                </select>
            </div>
            <div>
                <label htmlFor="productionEnvironment">Ambiente de produção</label>
                <select 
                    name="productionEnvironment" 
                    id="productionEnvironment"
                    value={formData.productionEnvironment}
                    onChange={onChange}
                    disabled={readOnly}
                    >
                    <option value="">Selecione uma opção</option>
                    <option value="implementado">Implementado</option>
                    <option value="planejado">Em andamento/Planejado</option>
                </select>
            </div>
            <div>
                <label htmlFor="deploymentEnvironmentNotes">Observações</label>
                <textarea 
                    name="deploymentEnvironmentNotes" id="deploymentEnvironmentNotes"
                    value={formData.deploymentEnvironmentNotes}
                    onChange={onChange}
                    disabled={readOnly}
                    placeholder="Detalhes sobre a configuração, restrições ou peculiaridades de cada ambiente."
                >
                </textarea>
            </div>
        </fieldset>
    )
}

FieldsetDeploymentEnvironment.propTypes = {
    formData: PropTypes.shape({
        developmentEnvironment: PropTypes.string,
        approvalEnvironment: PropTypes.string,
        productionEnvironment: PropTypes.string,
        deploymentEnvironmentNotes: PropTypes.string
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default FieldsetDeploymentEnvironment