pipeline {
    agent {
        node {
            label 'linux' // Ensure the Jenkins agent runs on Linux with Node.js and Docker installed
        }
    }
    
    // Trigger only on the main branch
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Check if the current build branch is 'main'
                    if (env.BRANCH_NAME != 'main') {
                        currentBuild.result = 'SUCCESS'
                        error("Stopping build: This pipeline only runs on the main branch.")
                    }
                }
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                // Install target browsers and linux system dependencies
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            environment {
                // Fetch credentials securely from Jenkins Credentials Provider
                BASE_URL       = 'https://automationexercise.com'
                LOGIN_EMAIL    = credentials('JENKINS_LOGIN_EMAIL')
                LOGIN_PASSWORD = credentials('JENKINS_LOGIN_PASSWORD')
                LOGIN_NAME     = 'Zakaria'
                DB_HOST        = '127.0.0.1'
                DB_USER        = credentials('JENKINS_DB_USER')
                DB_PASSWORD    = credentials('JENKINS_DB_PASSWORD')
                DB_NAME        = 'projet'
                DB_PORT        = '5432'
            }
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Archive and display the HTML execution report inside the Jenkins dashboard
            publishHTML([allowMissing: false, 
                         alwaysLinkToLastBuild: true, 
                         keepAll: true, 
                         reportDir: 'playwright-report', 
                         reportFiles: 'index.html', 
                         reportName: 'Playwright HTML Report', 
                         reportTitles: ''])
        }
    }
}