pipeline {
    agent any

    tools {
        nodejs 'node20' 
    }

    environment {
        BASE_URL                 = 'https://automationexercise.com'
        LOGIN_EMAIL              = 'testautomationmoufid@gmail.com'
        LOGIN_PASSWORD           = 'Zakaria2026'
        CI                       = 'true'
        // Isole le chemin des navigateurs pour éviter les blocages de droits système
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.cache/ms-playwright"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                // Installe proprement sans passer par root/sudo
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Execute Playwright Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'npx playwright test'
                }
            }
        }
    }

    post {
        always {
            // 1. Publication des résultats XML JUnit
            junit allowEmptyResults: true, testResults: 'playwright-report/results.xml'
            
            // 2. Archivage du dossier de rapport complet HTML
            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true, allowEmptyArchive: true
        }
    }
}