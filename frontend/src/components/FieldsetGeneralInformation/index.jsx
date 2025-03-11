import PropTypes from "prop-types"

const FieldsetGeneralInformation = ({formData, onChange, readOnly})=>{
    return(
        <fieldset>
            <legend>Informações gerais do projeto</legend>
            <div>
                <label htmlFor="projectName">Nome do projeto</label>
                <input 
                    type="text" 
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={onChange}
                    disabled={readOnly}
                    required
                />
            </div>
            <div>
                <label htmlFor="projectDescription">Descrição Resumida</label>
                <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={onChange}
                    disabled={readOnly}

                ></textarea>
            </div>
            <div>
                <label htmlFor="responsibleFillingOut">Responsável pelo preenchimento</label>
                <input 
                    type="text" 
                    name="responsibleFillingOut" 
                    id="responsibleFillingOut" 
                    value={formData.responsibleFillingOut}
                    onChange={onChange}
                    disabled={readOnly}
                    required
                />
            </div>

            <div>
                <label htmlFor="">Contato</label>
                <input
                    type="text"
                    name="responsibleContact"
                    id="responsibleContact"
                    value={formData.responsibleContact}
                    onChange={onChange}
                    disabled={readOnly}
                    required
                />
            </div> 
            <div>
                <label htmlFor="fillingDate">Data de Preenchimento</label>
                <input 
                    type="Date"
                    name="fillingDate"
                    id="fillingDate"
                    value={formData.fillingDate}
                    onChange={onChange}
                    disabled={readOnly}
                />
            </div> 
        </fieldset>
    )
}

FieldsetGeneralInformation.propTypes = {
    formData: PropTypes.shape({
        projectName: PropTypes.string,
        projectDescription: PropTypes.string,
        responsibleFillingOut: PropTypes.string,
        responsibleContact: PropTypes.string,
        fillingDate: PropTypes.string
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
};

export default FieldsetGeneralInformation