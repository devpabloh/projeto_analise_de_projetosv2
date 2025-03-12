import { useState, useRef, useEffect } from "react";
import styles from "./ProjectModal.module.css"
import FieldsetGeneralInformation from "../FieldsetGeneralInformation";
import FieldsetDevelopmentStatus from "../FieldsetDevelopmentStatus";
import FieldsetTestingAndQuality from "../FieldsetTestingAndQuality";
import FieldsetDeploymentEnvironment from "../FieldsetDeploymentEnvironment";
import FieldsetDocumentation from "../FieldsetDocumentation";
import FieldsetTeamAndSupport from "../FieldsetTeamAndSupport";
import FieldsetSecurityAndCompliance from "../FieldsetSecurityAndCompliance";
import FieldsetOtherConsiderations from "../FieldsetOtherConsiderations";
import PropTypes from 'prop-types';

function ProjectModal({isOpen, isClose, onSave, project, readOnly, onEdit}){
    const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    responsibleFillingOut: "",
    responsibleContact: "",
    fillingDate: new Date().toISOString().split('T')[0],
    developmentPhase: "",
    carriedOutTests: "",
    selectedTests: [],
    otherTestsDescription: "",
    frequencyAndAutomation: "",
    testingToolsUsed: "",
    developmentEnvironment: "",
    approvalEnvironment: "",
    productionEnvironment: "",
    deploymentEnvironmentNotes: "",
    hasDocumentation: "",
    documentationType: "",
    technicalDocumentation: "",
    linkTechnicalDocumentation: "",
    updatingTechnicalDocumentation: "",
    updateTechnicalVersion: "",
    functionalDocumentation: "",
    linkFunctionalDocumentation: "",
    updatingFunctionalDocumentation: "",
    updateFunctionalVersion: "",
    technicalLeaderName: "",
    projectManagerName: "",
    technicalSupport: "",
    supportName: "",
    supportPeriod: "",
    securityMeasures: "",
    whatSecurityMeasures: "",
    otherSecurityMeasures: "",
    compliance: "",
    whatCompliance: "",
    otherCompliance: "",
    challengesFaced: "",  // Ensure this matches backend field name
    identifiedRisks: "",
    additionalComments: "" 
    })

    const [changeHistory, setChangeHistory] = useState([]);

    useEffect(() => {
        if (project && project.id) {
            
            let formattedDate = new Date().toISOString().split('T')[0];
            if (project.fillingDate) {
                try {
                    formattedDate = new Date(project.fillingDate).toISOString().split('T')[0];
                } catch (error) {
                    console.error("Error formatting date:", error);
                }
            }
    
            const environments = project.environments || {};
            const documentations = project.documentations || {};
            const teams = project.Teams || {}; 
            const security = project.security || {};
            const additionalInfos = project.additionalInfos || {};
            const tests = project.tests || {}; 
            
            const formattedData = {
                id: project.id,
                projectName: project.projectName || "",
                projectDescription: project.projectDescription || "",
                responsibleFillingOut: project.responsibleFillingOut || "",
                responsibleContact: project.responsibleContact || "",
                fillingDate: formattedDate,
                developmentPhase: project.developmentPhase || "",
                carriedOutTests: tests.carriedOutTests || project.carriedOutTests || "",
                selectedTests: tests.selectedTests || project.selectedTests || [],
                otherTestsDescription: tests.otherTestsDescription || project.otherTestsDescription || "",
                frequencyAndAutomation: tests.frequencyAndAutomation || project.frequencyAndAutomation || "",
                testingToolsUsed: tests.testingToolsUsed || project.testingToolsUsed || "",
                developmentEnvironment: environments.developmentEnvironment || "",
                approvalEnvironment: environments.approvalEnvironment || "",
                productionEnvironment: environments.productionEnvironment || "",
                deploymentEnvironmentNotes: environments.deploymentEnvironmentNotes || "",
                hasDocumentation: project.hasDocumentation === true ? "sim" : "nao",
                documentationType: project.documentationType || "",
                technicalDocumentation: documentations.technicalDocumentation || "",
                linkTechnicalDocumentation: documentations.linkTechnicalDocumentation || "",
                updatingTechnicalDocumentation: documentations.updatingTechnicalDocumentation || "",
                updateTechnicalVersion: documentations.updateTechnicalVersion || "",
                functionalDocumentation: documentations.functionalDocumentation || "",
                linkFunctionalDocumentation: documentations.linkFunctionalDocumentation || "",
                updatingFunctionalDocumentation: documentations.updatingFunctionalDocumentation || "",
                updateFunctionalVersion: documentations.updateFunctionalVersion || "",
                technicalLeaderName: teams.technicalLeaderName || "",
                projectManagerName: teams.projectManagerName || "",
                technicalSupport: teams.technicalSupport || "",
                supportName: teams.supportName || "",
                supportPeriod: teams.supportPeriod || "",
                securityMeasures: security.securityMeasures === true ? "sim" : "nao",
                whatSecurityMeasures: security.whatSecurityMeasures || "",
                otherSecurityMeasures: security.otherSecurityMeasures || "",
                compliance: security.compliance === true ? "sim" : "nao",
                whatCompliance: security.whatCompliance || "",
                otherCompliance: security.otherCompliance || "",
                challengesFaced: additionalInfos.challengesFaced || "",
                identifiedRisks: additionalInfos.identifiedRisks || "",
                additionalComments: additionalInfos.additionalComments || ""
            };
            
            // Add last editor information if available
            if (project.Owner) {
                formattedData.lastEditor = {
                    id: project.Owner.id,
                    name: project.Owner.name || project.Owner.email,
                    date: new Date(project.updatedAt || project.createdAt).toLocaleString()
                };
            }
    
            setFormData(formattedData);
            
            // Fetch or simulate project history
            if (project.updatedAt && project.createdAt) {
                fetchProjectHistory(project.id);
            }
        }
    }, [project]);
    
    const fetchProjectHistory = async (projectId) => {
        try {
            // Simulação de dados - em produção, substitua por uma chamada API real
            if (project) {  // Check if project exists
                const mockHistory = [
                    {
                        id: projectId,  // Use projectId parameter instead of project.id
                        projectName: project.projectName,
                        userName: project.Owner?.name || project.Owner?.email || "Usuário desconhecido",
                        userId: project.Owner?.id,
                        changes: [
                            { field: "Nome do Projeto", oldValue: "Versão anterior", newValue: project.projectName },
                            { field: "Fase de Desenvolvimento", oldValue: "Em planejamento", newValue: project.developmentPhase }
                        ],
                        timestamp: new Date(project.updatedAt || project.createdAt).toLocaleString()
                    }
                ];
                setChangeHistory(mockHistory);
            }
            
            // Chamada API real (comentada)
            // const response = await fetch(`/api/projects/${projectId}/history`);
            // const data = await response.json();
            // setChangeHistory(data);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        }
    };
    
    // Função para visualizar histórico completo
    const handleViewHistory = () => {
        // Implementar navegação para página de histórico completo
        // Pode usar react-router ou abrir em nova janela
        window.open(`/project-history/${project.id}`, '_blank');
    };

    const modalRef = useRef()

    const handleOverlayClick = (evento)=>{
        if(modalRef.current && !modalRef.current.contains(evento.target)){
            isClose()
        }
    }

    const handleChange = (evento) => {
        const { name, value, type, checked } = evento.target;
        setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
    }));
    };

    const handleSubmit = (evento)=>{
        evento.preventDefault()
        onSave(formData)    
    }

    if (!isOpen) return null;

    return(
        <div className={styles.overlayStyle} onClick={handleOverlayClick}>
            <div className={styles.modalStyle} ref={modalRef} onClick={(e) => e.stopPropagation()}>

                <fieldset>
                    <legend>{project && project.id ? (readOnly ? 'Detalhes do projeto' : 'Editar Projeto') : 'Adicionar projeto'}</legend>

                    {project && project.id && (
                        <div className={styles.projectInfo}>
                            <div className={styles.projectHeader}>
                                <h3>{project.projectName}</h3>
                                <span className={styles.projectId}>ID: {project.id}</span>
                            </div>
                            
                            {formData.lastEditor && (
                                <div className={styles.lastEditInfo}>
                                    <span className={styles.editLabel}>Última modificação:</span>
                                    <span className={styles.editUser}>{formData.lastEditor.name}</span>
                                    <span className={styles.editDate}>{formData.lastEditor.date}</span>
                                </div>
                            )}
                            
                            {changeHistory.length > 0 && (
                                <div className={styles.historySection}>
                                    <h4>Alterações Recentes</h4>
                                    
                                    {changeHistory.map((entry, index) => (
                                        <div key={index} className={styles.historyEntry}>
                                            <div className={styles.historyHeader}>
                                                <div className={styles.historyUser}>
                                                    <span className={styles.userName}>{entry.userName}</span>
                                                    <span className={styles.userId}>ID: {entry.userId}</span>
                                                </div>
                                                <div className={styles.historyTime}>{entry.timestamp}</div>
                                            </div>
                                            
                                            <div className={styles.changesList}>
                                                {entry.changes.map((change, changeIndex) => (
                                                    <div key={changeIndex} className={styles.changeItem}>
                                                        <div className={styles.changeField}>{change.field}</div>
                                                        <div className={styles.changeValues}>
                                                            <div className={styles.oldValue}>
                                                                <span className={styles.valueLabel}>Anterior:</span>
                                                                <span>{change.oldValue}</span>
                                                            </div>
                                                            <div className={styles.newValue}>
                                                                <span className={styles.valueLabel}>Atual:</span>
                                                                <span>{change.newValue}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        type="button" 
                                        className={styles.historyButton}
                                        onClick={handleViewHistory}
                                    >
                                        Ver Histórico Completo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FieldsetGeneralInformation
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetDevelopmentStatus
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetTestingAndQuality
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetDeploymentEnvironment
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetDocumentation
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetTeamAndSupport
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetSecurityAndCompliance
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <FieldsetOtherConsiderations
                            formData={formData}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                        <div className={styles.containerButtons}>
                            {readOnly ? (
                                <>
                                    <button type="button" onClick={isClose} className={styles.buttonModal}>
                                        Fechar
                                    </button>
                                    <button type="button" onClick={onEdit} className={styles.buttonModal}>
                                        Editar
                                    </button>
                                </>
                            ): (
                                <>
                                    <button type="submit" className={styles.buttonModal}>
                                        Salvar
                                    </button>
                                    <button type="button" onClick={isClose} className={styles.buttonModal}>
                                        Cancelar
                                    </button>
                                </>
                            )}
                            
                        </div>
                    </form>
                </fieldset>
                
            </div>
        </div>  
    )
}
ProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    project: PropTypes.object,
    readOnly: PropTypes.bool,
    onEdit: PropTypes.func
};
export default ProjectModal;