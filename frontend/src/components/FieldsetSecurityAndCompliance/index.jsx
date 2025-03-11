import PropTypes from 'prop-types';

const FieldsetSecurityAndCompliance = ({formData, onChange, readOnly})=>{
    return (
        <fieldset>
            <legend>Segurança e Conformidade</legend>
            <div>
                <label htmlFor="securityMeasures">Foram implementadas medidas de segurança no projeto</label>
                <select 
                    name="securityMeasures" 
                    id="securityMeasures"
                    value={formData.securityMeasures}
                    onChange={onChange}
                    disabled={readOnly}
                    >
                    <option value="">Selecione uma opção</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                </select>
            </div>
            {formData.securityMeasures === "sim" && (
                <div>
                    <label htmlFor="whatSecurityMeasures">Quais medidas de segurança foram implementadas</label>
                    <select 
                        name="whatSecurityMeasures" 
                        id="whatSecurityMeasures"
                        value={formData.whatSecurityMeasures}
                        onChange={onChange}
                        disabled={readOnly}
                    >
                        <option value="">Selecione uma opção</option>
                        <option value="criptografiaDeDados">Criptografia de dados</option>
                        <option value="controleDeAcessoEAutenticacao">Controle de acesso e autenticação</option>
                        <option value="logsDeAuditoria">Logs de auditoria</option>
                        <option value="protecaoContraAtaques">Proteção contra ataques (DDoS, SQL Injection, etc.)</option>
                        <option value="outrasMedidasDeSeguranca">Outras medidas de segurança</option>
                    </select>
                </div>
            )}
            {formData.whatSecurityMeasures === "outrasMedidasDeSeguranca" && (
                <div>
                    <label htmlFor="otherSecurityMeasures">Outras medidas de segurança</label>
                    <input
                        type="text"
                        id="otherSecurityMeasures"
                        name="otherSecurityMeasures"
                        value={formData.otherSecurityMeasures}
                        onChange={onChange}
                        placeholder="Quais são as outras medidas de segurança."
                        disabled={readOnly}
                    />
                </div>)}
                <div>
                    <label htmlFor="compliance">O projeto atende a alguma norma de conformidade</label>
                    <select
                        name="compliance"
                        id="compliance"
                        value={formData.compliance}
                        onChange={onChange}
                        disabled={readOnly}
                    >
                        <option value="">Selecione uma opção</option>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                {formData.compliance === "sim" && (
                    <div>
                        <label htmlFor="whatCompliance">Quais normas de conformidade o projeto atende</label>
                        <select
                            name="whatCompliance"
                            id="whatCompliance"
                            value={formData.whatCompliance}
                            onChange={onChange}
                            disabled={readOnly}
                        >
                            <option value="">Selecione uma opção</option>
                            <option value="LGPD">LGPD</option>
                            <option value="GDPR">GDPR</option>
                            <option value="ISO27001">ISO 27001</option>
                            <option value="PCI-DSS">PCI-DSS</option>
                            <option value="outrasNormasDeConformidade">Outras normas de conformidade</option>
                        </select>
                    </div>
                )}
                {formData.whatCompliance === "outrasNormasDeConformidade" && (
                    <div>
                        <label htmlFor="otherCompliance">Outras normas de conformidade</label>
                        <input
                            type="text"
                            id="otherCompliance"
                            name="otherCompliance"
                            value={formData.otherCompliance}
                            onChange={onChange}
                            placeholder="Quais são as outras normas de conformidade."
                            disabled={readOnly}
                        />
                    </div>
                )}
        </fieldset>
    )
}

FieldsetSecurityAndCompliance.propTypes = {
    formData: PropTypes.shape({
        securityMeasures: PropTypes.string,
        whatSecurityMeasures: PropTypes.string,
        otherSecurityMeasures: PropTypes.string,
        compliance: PropTypes.string,
        whatCompliance: PropTypes.string,
        otherCompliance: PropTypes.string
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default FieldsetSecurityAndCompliance