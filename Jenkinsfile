pipeline {
    agent any

    tools {
        // Assure-toi que Node.js v20 est configuré dans le menu "Global Tool Configuration" de ton Jenkins sous ce nom
        nodejs 'node20' 
    }

    environment {
        BASE_URL       = 'https://automationexercise.com'
        LOGIN_EMAIL    = 'testautomationmoufid@gmail.com'
        LOGIN_PASSWORD = 'Zakaria2026'
        CI             = 'true'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Installe les navigateurs requis et leurs dépendances système sous Linux
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Execute Playwright Tests') {
            steps {
                // Exécute les tests. Le "catchError" permet de continuer pour publier les rapports même s'il y a un échec
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'npx playwright test'
                }
            }
        }
    }

    post {
        always {
            // 1. Publie les résultats de tests XML sur l'interface Jenkins (nécessite le plugin JUnit)
            junit allowEmptyResults: true, testResults: 'playwright-report/results.xml'
            
            // 2. Archive le rapport HTML complet de Playwright pour pouvoir le télécharger ou le visionner
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
        }
    }
}