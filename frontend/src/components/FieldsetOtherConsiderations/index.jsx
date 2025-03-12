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
                    value={formData.challengesFaced || formData.challenges || ""}
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
                    value={formData.identifiedRisks || ""}
                    onChange={onChange}
                    placeholder="Riscos identificados para a continuidade do projeto."
                    disabled={readOnly}
                />
            </div>
            <div>
                <label htmlFor="additionalComments">Comentários adicionais</label>
                <textarea
                    name="additionalComments"
                    id="additionalComments"
                    value={formData.additionalComments || formData.commentsAdditionals || ""}
                    onChange={onChange}
                    placeholder="Comentários adicionais sobre o projeto."
                    disabled={readOnly}
                />
            </div>
        </fieldset>
    )
}

FieldsetOtherConsiderations.propTypes = {
    formData: PropTypes.shape({
        challengesFaced: PropTypes.string,
        challenges: PropTypes.string, // For backward compatibility
        identifiedRisks: PropTypes.string,
        additionalComments: PropTypes.string,
        commentsAdditionals: PropTypes.string // For backward compatibility
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default FieldsetOtherConsiderations;