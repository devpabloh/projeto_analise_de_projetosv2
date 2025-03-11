import User from './user.js';
import Project from './Project.js';
import Test from './Test.js';
import Environment from './Environment.js';
import Documentation from './Documentation.js';
import Team from './Team.js';
import Security from './Security.js';
import AdditionalInfo from './AdditionalInfo.js';

// User <-> Project associação
User.hasMany(Project, {
    foreignKey: 'userId',
    as: 'projects'
});

Project.belongsTo(User, {
    foreignKey: 'userId',
    as: 'Owner'
});

// Project <-> Test associação
Project.hasOne(Test, {
    foreignKey: 'projectId',
    as: 'tests'
});

Test.belongsTo(Project, {
    foreignKey: 'projectId'
});

// Project <-> Environment associação
Project.hasOne(Environment, {
    foreignKey: 'projectId',
    as: 'environments'
});

Environment.belongsTo(Project, {
    foreignKey: 'projectId'
});

// Project <-> Documentation associação
Project.hasOne(Documentation, {
    foreignKey: 'projectId',
    as: 'documentations'
});

Documentation.belongsTo(Project, {
    foreignKey: 'projectId'
});

// Project <-> Team associação
Project.hasOne(Team, {
    foreignKey: 'projectId',
    as: 'Teams'
});

Team.belongsTo(Project, {
    foreignKey: 'projectId'
});

// Project <-> Security associação
Project.hasOne(Security, {
    foreignKey: 'projectId',
    as: 'security'
});

Security.belongsTo(Project, {
    foreignKey: 'projectId'
});

// Project <-> AdditionalInfo associação
Project.hasOne(AdditionalInfo, {
    foreignKey: 'projectId',
    as: 'additionalInfos'
});

AdditionalInfo.belongsTo(Project, {
    foreignKey: 'projectId'
});

export {
    User,
    Project,
    Test,
    Environment,
    Documentation,
    Team,
    Security,
    AdditionalInfo
};
export async function createProject(requisicao, resposta) {
    try {
        const userId = requisicao.user.id;
        console.log('Received data:', requisicao.body);
        console.log('User ID:', userId);
        
        // Extrair dados para cada tabela
        const {
            // Dados do projeto principal
            projectName, projectDescription, responsibleFillingOut, responsibleContact,
            fillingDate, developmentPhase, hasDocumentation, documentationType,
            
            // Dados de teste
            carriedOutTests, selectedTests, otherTestsDescription, 
            frequencyAndAutomation, testingToolsUsed,
            
            // Dados de ambiente
            developmentEnvironment, approvalEnvironment, productionEnvironment,
            deploymentEnvironmentNotes,
            
            // Dados de documentação
            technicalDocumentation, linkTechnicalDocumentation, updatingTechnicalDocumentation,
            updateTechnicalVersion, functionalDocumentation, linkFunctionalDocumentation,
            updatingFunctionalDocumentation, updateFunctionalVersion,
            
            // Dados de equipe
            technicalLeaderName, projectManagerName, technicalSupport,
            supportName, supportPeriod,
            
            // Dados de segurança
            securityMeasures, whatSecurityMeasures, otherSecurityMeasures,
            compliance, whatCompliance, otherCompliance,
            
            // Dados adicionais
            challengesFaced, identifiedRisks, additionalComments
        } = requisicao.body;
        
        // Criar o projeto principal
        const project = await Project.create({
            userId,
            projectName,
            projectDescription,
            responsibleFillingOut,
            responsibleContact,
            fillingDate,
            developmentPhase,
            hasDocumentation,
            documentationType
        });
        
        // Criar registro de testes
        await Test.create({
            projectId: project.id,
            carriedOutTests,
            selectedTests,
            otherTestsDescription,
            frequencyAndAutomation,
            testingToolsUsed
        });
        
        // Criar registro de ambiente
        await Environment.create({
            projectId: project.id,
            developmentEnvironment,
            approvalEnvironment,
            productionEnvironment,
            deploymentEnvironmentNotes
        });
        
        // Criar registro de documentação
        await Documentation.create({
            projectId: project.id,
            technicalDocumentation,
            linkTechnicalDocumentation,
            updatingTechnicalDocumentation,
            updateTechnicalVersion,
            functionalDocumentation,
            linkFunctionalDocumentation,
            updatingFunctionalDocumentation,
            updateFunctionalVersion
        });
        
        // Criar registro de equipe
        await Team.create({
            projectId: project.id,
            technicalLeaderName,
            projectManagerName,
            technicalSupport,
            supportName,
            supportPeriod
        });
        
        // Criar registro de segurança
        await Security.create({
            projectId: project.id,
            securityMeasures,
            whatSecurityMeasures,
            otherSecurityMeasures,
            compliance,
            whatCompliance,
            otherCompliance
        });
        
        // Criar registro de informações adicionais
        await AdditionalInfo.create({
            projectId: project.id,
            challengesFaced,
            identifiedRisks,
            additionalComments
        });
        
        resposta.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        resposta.status(500).json({ error: error.message });
    }
}