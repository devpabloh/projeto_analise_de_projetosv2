import Project from "../models/Project.js";
import User from "../models/user.js";
import Test from "../models/Test.js";
import Environment from "../models/Environment.js";
import Documentation from "../models/Documentation.js";
import Team from "../models/Team.js";
import Security from "../models/Security.js";
import AdditionalInfo from "../models/AdditionalInfo.js";
import sequelize from "../config/database.js";

export async function createProject(requisicao, resposta) {
    const transaction = await sequelize.transaction();
    try {
        const userId = requisicao.user.id;
        console.log('Received data:', requisicao.body);
        console.log('User ID:', userId);

        // Validação básica
        if (!requisicao.body.projectName || !requisicao.body.projectDescription) {
            return resposta.status(400).json({ error: 'Nome e descrição do projeto são obrigatórios' });
        }

        const formData = { ...requisicao.body };

        // Converter campos booleanos
        const booleanFields = ['hasDocumentation', 'securityMeasures', 'compliance'];
        booleanFields.forEach(field => {
            if (formData[field] === 'sim') formData[field] = true;
            else if (formData[field] === 'não' || formData[field] === 'nao') formData[field] = false;
        });

        // Converter datas
        const dateFields = ['updatingTechnicalDocumentation', 'updatingFunctionalDocumentation'];
        dateFields.forEach(field => {
            if (formData[field]) {
                try {
                    formData[field] = new Date(formData[field]);
                    if (isNaN(formData[field])) formData[field] = null;
                } catch (e) {
                    formData[field] = null;
                }
            } else {
                formData[field] = null;
            }
        });

        // Fix field name mismatch if needed
        if (formData.commentsAdditionals && !formData.additionalComments) {
            formData.additionalComments = formData.commentsAdditionals;
        }

        if (formData.challenges && !formData.challengesFaced) {
            formData.challengesFaced = formData.challenges;
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
        }, { transaction });

        // Criar registros relacionados
        await Promise.all([
            Test.create({
                projectId: project.id,
                carriedOutTests: formData.carriedOutTests,
                selectedTests: formData.selectedTests,
                otherTestsDescription: formData.otherTestsDescription,
                frequencyAndAutomation: formData.frequencyAndAutomation,
                testingToolsUsed: formData.testingToolsUsed
            }, { transaction }),
            Environment.create({
                projectId: project.id,
                developmentEnvironment: formData.developmentEnvironment,
                approvalEnvironment: formData.approvalEnvironment,
                productionEnvironment: formData.productionEnvironment,
                deploymentEnvironmentNotes: formData.deploymentEnvironmentNotes
            }, { transaction }),
            Documentation.create({
                projectId: project.id,
                technicalDocumentation: formData.technicalDocumentation,
                linkTechnicalDocumentation: formData.linkTechnicalDocumentation,
                updatingTechnicalDocumentation: formData.updatingTechnicalDocumentation,
                updateTechnicalVersion: formData.updateTechnicalVersion,
                functionalDocumentation: formData.functionalDocumentation,
                linkFunctionalDocumentation: formData.linkFunctionalDocumentation,
                updatingFunctionalDocumentation: formData.updatingFunctionalDocumentation,
                updateFunctionalVersion: formData.updateFunctionalVersion
            }, { transaction }),
            Team.create({
                projectId: project.id,
                technicalLeaderName: formData.technicalLeaderName,
                projectManagerName: formData.projectManagerName,
                technicalSupport: formData.technicalSupport,
                supportName: formData.supportName,
                supportPeriod: formData.supportPeriod
            }, { transaction }),
            Security.create({
                projectId: project.id,
                securityMeasures: formData.securityMeasures,
                whatSecurityMeasures: formData.whatSecurityMeasures,
                otherSecurityMeasures: formData.otherSecurityMeasures,
                compliance: formData.compliance,
                whatCompliance: formData.whatCompliance,
                otherCompliance: formData.otherCompliance
            }, { transaction }),
            AdditionalInfo.create({
                projectId: project.id,
                challengesFaced: formData.challengesFaced,
                identifiedRisks: formData.identifiedRisks,
                additionalComments: formData.additionalComments
            }, { transaction })
        ]);

        await transaction.commit();

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
        await transaction.rollback();
        console.error('Error creating project:', error);
        resposta.status(500).json({ 
            error: 'Erro ao criar projeto',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
    const transaction = await sequelize.transaction();
    try {
        const projectId = requisicao.params.id;
        const userId = requisicao.user.id;

        const project = await Project.findOne({ 
            where: { id: projectId },
            include: [
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

        if (requisicao.user.role !== "admin" && project.userId !== userId) {
            return resposta.status(403).json({ message: "Acesso negado, não é o proprietário do projeto." });
        }

        const formData = { ...requisicao.body };

        // Converter campos booleanos
        const booleanFields = ['hasDocumentation', 'securityMeasures', 'compliance'];
        booleanFields.forEach(field => {
            if (formData[field] === 'sim') formData[field] = true;
            else if (formData[field] === 'não' || formData[field] === 'nao') formData[field] = false;
        });

        // Converter datas
        const dateFields = ['updatingTechnicalDocumentation', 'updatingFunctionalDocumentation'];
        dateFields.forEach(field => {
            if (formData[field]) {
                try {
                    formData[field] = new Date(formData[field]);
                    if (isNaN(formData[field])) formData[field] = null;
                } catch (e) {
                    formData[field] = null;
                }
            } else {
                formData[field] = null;
            }
        });

        // Fix field name mismatch if needed
        if (formData.commentsAdditionals && !formData.additionalComments) {
            formData.additionalComments = formData.commentsAdditionals;
        }

        if (formData.challenges && !formData.challengesFaced) {
            formData.challengesFaced = formData.challenges;
        }

        // Atualizar o projeto principal
        await project.update({
            projectName: formData.projectName,
            projectDescription: formData.projectDescription,
            responsibleFillingOut: formData.responsibleFillingOut,
            responsibleContact: formData.responsibleContact,
            fillingDate: formData.fillingDate,
            developmentPhase: formData.developmentPhase,
            hasDocumentation: formData.hasDocumentation,
            documentationType: formData.documentationType
        }, { transaction });

        // Atualizar registros relacionados
        if (project.tests) {
            await project.tests.update({
                carriedOutTests: formData.carriedOutTests,
                selectedTests: formData.selectedTests,
                otherTestsDescription: formData.otherTestsDescription,
                frequencyAndAutomation: formData.frequencyAndAutomation,
                testingToolsUsed: formData.testingToolsUsed
            }, { transaction });
        }

        if (project.environments) {
            await project.environments.update({
                developmentEnvironment: formData.developmentEnvironment,
                approvalEnvironment: formData.approvalEnvironment,
                productionEnvironment: formData.productionEnvironment,
                deploymentEnvironmentNotes: formData.deploymentEnvironmentNotes
            }, { transaction });
        }

        if (project.documentations) {
            await project.documentations.update({
                technicalDocumentation: formData.technicalDocumentation,
                linkTechnicalDocumentation: formData.linkTechnicalDocumentation,
                updatingTechnicalDocumentation: formData.updatingTechnicalDocumentation,
                updateTechnicalVersion: formData.updateTechnicalVersion,
                functionalDocumentation: formData.functionalDocumentation,
                linkFunctionalDocumentation: formData.linkFunctionalDocumentation,
                updatingFunctionalDocumentation: formData.updatingFunctionalDocumentation,
                updateFunctionalVersion: formData.updateFunctionalVersion
            }, { transaction });
        }

        if (project.Teams) {
            await project.Teams.update({
                technicalLeaderName: formData.technicalLeaderName,
                projectManagerName: formData.projectManagerName,
                technicalSupport: formData.technicalSupport,
                supportName: formData.supportName,
                supportPeriod: formData.supportPeriod
            }, { transaction });
        }

        if (project.security) {
            await project.security.update({
                securityMeasures: formData.securityMeasures,
                whatSecurityMeasures: formData.whatSecurityMeasures,
                otherSecurityMeasures: formData.otherSecurityMeasures,
                compliance: formData.compliance,
                whatCompliance: formData.whatCompliance,
                otherCompliance: formData.otherCompliance
            }, { transaction });
        }

        if (project.additionalInfos) {
            await project.additionalInfos.update({
                challengesFaced: formData.challengesFaced,
                identifiedRisks: formData.identifiedRisks,
                additionalComments: formData.additionalComments
            }, { transaction });
        }

        await transaction.commit();

        // Buscar o projeto atualizado com todas as relações
        const updatedProject = await Project.findOne({
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

        resposta.status(200).json(updatedProject);
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating project:', error);
        resposta.status(500).json({ 
            error: 'Erro ao atualizar projeto',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export async function deleteProject(requisicao, resposta) {
    const transaction = await sequelize.transaction();
    try {
        const projectId = requisicao.params.id;
        const userId = requisicao.user.id;

        const project = await Project.findOne({ where: { id: projectId } });
        if (!project) {
            return resposta.status(404).json({ message: "O projeto não foi encontrado." });
        }

        if (requisicao.user.role !== 'admin' && project.userId !== userId) {
            return resposta.status(403).json({ message: "Você não tem permissão para deletar este projeto." });
        }

        await project.destroy({ transaction });
        await transaction.commit();
        
        resposta.status(200).json({ message: "Projeto deletado com sucesso." });
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting project:', error);
        resposta.status(500).json({ 
            error: 'Erro ao deletar projeto',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
        console.error('Error getting project:', error);
        resposta.status(500).json({ 
            error: "Ocorreu um erro interno no servidor",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}