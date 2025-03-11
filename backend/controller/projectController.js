import Project from "../models/Project.js";
import User from "../models/user.js";
import Test from "../models/Test.js";
import Environment from "../models/Environment.js";
import Documentation from "../models/Documentation.js";
import Team from "../models/Team.js";
import Security from "../models/Security.js";
import AdditionalInfo from "../models/AdditionalInfo.js";

export async function createProject(requisicao, resposta) {
    try {
        const userId = requisicao.user.id;
        console.log('Received data:', requisicao.body);
        console.log('User ID:', userId);

        // Criar uma cópia dos dados para manipulação
        const formData = { ...requisicao.body };

        // Converter campos booleanos
        if (formData.hasDocumentation === 'sim') formData.hasDocumentation = true;
        else if (formData.hasDocumentation === 'não' || formData.hasDocumentation === 'nao') formData.hasDocumentation = false;
        
        if (formData.securityMeasures === 'sim') formData.securityMeasures = true;
        else if (formData.securityMeasures === 'não' || formData.securityMeasures === 'nao') formData.securityMeasures = false;
        
        if (formData.compliance === 'sim') formData.compliance = true;
        else if (formData.compliance === 'não' || formData.compliance === 'nao') formData.compliance = false;

        if (!formData.updatingTechnicalDocumentation || formData.updatingTechnicalDocumentation === '') {
            formData.updatingTechnicalDocumentation = null;
        } else {
            // Tentar converter para data válida
            try {
                formData.updatingTechnicalDocumentation = new Date(formData.updatingTechnicalDocumentation);
                if (isNaN(formData.updatingTechnicalDocumentation)) {
                    formData.updatingTechnicalDocumentation = null;
                }
            } catch (e) {
                formData.updatingTechnicalDocumentation = null;
            }
        }

        if (!formData.updatingFunctionalDocumentation || formData.updatingFunctionalDocumentation === '') {
            formData.updatingFunctionalDocumentation = null;
        } else {
            // Tentar converter para data válida
            try {
                formData.updatingFunctionalDocumentation = new Date(formData.updatingFunctionalDocumentation);
                if (isNaN(formData.updatingFunctionalDocumentation)) {
                    formData.updatingFunctionalDocumentation = null;
                }
            } catch (e) {
                formData.updatingFunctionalDocumentation = null;
            }
        }
        
        
        // Criar o projeto principal usando formData em vez de requisicao.body
        const project = await Project.create({
            userId,
            projectName: formData.projectName,
            projectDescription: formData.projectDescription,
            responsibleFillingOut: formData.responsibleFillingOut,
            responsibleContact: formData.responsibleContact,
            fillingDate: formData.fillingDate,
            developmentPhase: formData.developmentPhase,
            hasDocumentation: formData.hasDocumentation,
            documentationType: formData.documentationType
        });
        
        // Criar registro de testes
        await Test.create({
            projectId: project.id,
            carriedOutTests: formData.carriedOutTests,
            selectedTests: formData.selectedTests,
            otherTestsDescription: formData.otherTestsDescription,
            frequencyAndAutomation: formData.frequencyAndAutomation,
            testingToolsUsed: formData.testingToolsUsed
        });
        
        // Criar registro de ambiente
        await Environment.create({
            projectId: project.id,
            developmentEnvironment: formData.developmentEnvironment,
            approvalEnvironment: formData.approvalEnvironment,
            productionEnvironment: formData.productionEnvironment,
            deploymentEnvironmentNotes: formData.deploymentEnvironmentNotes
        });
        
        // Criar registro de documentação
        await Documentation.create({
            projectId: project.id,
            technicalDocumentation: formData.technicalDocumentation,
            linkTechnicalDocumentation: formData.linkTechnicalDocumentation,
            updatingTechnicalDocumentation: formData.updatingTechnicalDocumentation,
            updateTechnicalVersion: formData.updateTechnicalVersion,
            functionalDocumentation: formData.functionalDocumentation,
            linkFunctionalDocumentation: formData.linkFunctionalDocumentation,
            updatingFunctionalDocumentation: formData.updatingFunctionalDocumentation,
            updateFunctionalVersion: formData.updateFunctionalVersion
        });
        
        // Criar registro de equipe
        await Team.create({
            projectId: project.id,
            technicalLeaderName: formData.technicalLeaderName,
            projectManagerName: formData.projectManagerName,
            technicalSupport: formData.technicalSupport,
            supportName: formData.supportName,
            supportPeriod: formData.supportPeriod
        });
        
        // Criar registro de segurança
        await Security.create({
            projectId: project.id,
            securityMeasures: formData.securityMeasures,
            whatSecurityMeasures: formData.whatSecurityMeasures,
            otherSecurityMeasures: formData.otherSecurityMeasures,
            compliance: formData.compliance,
            whatCompliance: formData.whatCompliance,
            otherCompliance: formData.otherCompliance
        });
        
        // Criar registro de informações adicionais
        await AdditionalInfo.create({
            projectId: project.id,
            challengesFaced: formData.challengesFaced,
            identifiedRisks: formData.identifiedRisks,
            additionalComments: formData.additionalComments
        });
        
        // Buscar o projeto completo com todas as relações
        const completeProject = await Project.findOne({
            where: { id: project.id },
            include: [
                { model: User, as: 'Owner' },
                { model: Test, as: 'tests' },
                { model: Environment, as: 'environments' },
                { model: Documentation, as: 'documentations' },
                { model: Team, as: 'Teams' },
                { model: Security, as: 'security' },
                { model: AdditionalInfo, as: 'additionalInfos' }
            ]
        });
        
        resposta.status(201).json(completeProject);
    } catch (error) {
        console.error('Error creating project:', error);
        resposta.status(500).json({ error: error.message });
    }
}

export async function listProjects(requisicao, resposta) {
    try {
        const includes = [
            { model: User, as: 'Owner' },
            { model: Test, as: 'tests' },
            { model: Environment, as: 'environments' },
            { model: Documentation, as: 'documentations' },
            { model: Team, as: 'Teams' },
            { model: Security, as: 'security' },
            { model: AdditionalInfo, as: 'additionalInfos' }
        ];
        
        let projects;
        if (requisicao.user.role === 'admin') {
            projects = await Project.findAll({
                include: includes
            });
        } else {
            projects = await Project.findAll({
                where: { userId: requisicao.user.id },
                include: includes
            });
        }
        return resposta.json(projects);
    } catch (error) {
        console.error('Error in listProjects:', error);
        return resposta.status(500).json({ 
            error: 'Erro ao listar projetos',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export async function updateProject(requisicao, resposta) {
    try {
        const projectId = requisicao.params.id;
        const userId = requisicao.user.id;

        const project = await Project.findOne({ where: { id: projectId } });
        if (!project) {
            return resposta.status(404).json({ message: "O projeto não foi encontrado." });
        }

        if (requisicao.user.role !== "admin" && project.userId !== userId) {
            return resposta.status(403).json({ message: "Acesso negado, não é o proprietário do projeto." });
        }

        await project.update(requisicao.body);
        resposta.status(200).json(project);
    } catch (error) {
        resposta.status(500).json({ error: error.message });
    }
}


export async function deleteProject(requisicao, resposta) {
    try {
        const projectId = requisicao.params.id;
        const userId = requisicao.user.id;

        const project = await Project.findOne({ where: { id: projectId } });
        if (!project) {
            return resposta.status(404).json({ message: "O projeto não foi encontrado." });
        }

        // Correção: Comparar project.userId, não projectId
        if (requisicao.user.role !== 'admin' && project.userId !== userId) {
            return resposta.status(403).json({ message: "Você não tem permissão para deletar este projeto." });
        }

        await project.destroy();
        resposta.status(200).json({ message: "Projeto deletado com sucesso." });
    } catch (error) {
        resposta.status(500).json({ error: error.message });
    }
}


export async function getProjectId(requisicao, resposta) {
    try {
        const projectId = requisicao.params.id;
        const userId = requisicao.user.id;

        const project = await Project.findOne({ 
            where: { id: projectId },
            include: [
                { model: User, as: 'Owner' },
                { model: Test, as: 'tests' },
                { model: Environment, as: 'environments' },
                { model: Documentation, as: 'documentations' },
                { model: Team, as: 'Teams' },
                { model: Security, as: 'security' },
                { model: AdditionalInfo, as: 'additionalInfos' }
            ]
        });
        
        if (!project) {
            return resposta.status(404).json({ message: "O projeto não foi encontrado." });
        }

        if (requisicao.user.role !== 'admin' && project.userId !== userId) {
            return resposta.status(403).json({ message: "Você não tem permissão para visualizar este projeto." });
        }

        resposta.status(200).json(project);
    } catch (error) {
        resposta.status(500).json({ error: "Ocorreu um erro interno no servidor" });
    }
}
