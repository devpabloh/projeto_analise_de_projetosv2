import PropTypes from 'prop-types';

const FieldsetOtherConsiderations = ({formData, onChange, readOnly})=>{
    return (
        <fieldset>
            <legend>Outras Considerações</legend>
            <div>
                    <label htmlFor="challengesFaced">Principais desafios enfrentados até agora</label>
                    <textarea
                        name="challengesFaced"
                        id="challengesFaced"
                        value={formData.challenges}
                        onChange={onChange}
                        placeholder="Principais desafios enfrentados até agora."
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label htmlFor="identifiedRisks">Riscos identificados para a continuidade do projeto</label>
                    <textarea
                        name="identifiedRisks"
                        id="identifiedRisks"
                        value={formData.identifiedRisks}
                        onChange={onChange}
                        placeholder="Riscos identificados para a continuidade do projeto."
                        disabled={readOnly}
                    />
                </div>
                <div>
                    <label htmlFor="commentsAdditionals">Comentários adicionais</label>
                    <textarea
                        name="commentsAdditionals"
                        id="commentsAdditionals"
                        value={formData.commentsAdditionals}
                        onChange={onChange}
                        placeholder="Comentários adicionais."
                        disabled={readOnly}
                    />
                </div>
        </fieldset>
    )
}

FieldsetOtherConsiderations.propTypes = {
    formData: PropTypes.shape({
        challenges: PropTypes.string,
        identifiedRisks: PropTypes.string,
        commentsAdditionals: PropTypes.string
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default FieldsetOtherConsiderations;