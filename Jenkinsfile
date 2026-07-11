pipeline {
    agent {
        docker { image 'mcr.microsoft.com/playwright:v1.45.0-jammy' }
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            publishHTML([allowMissing: false, 
                         alwaysLinkToLastBuild: true, 
                         keepAll: true, 
                         reportDir: 'playwright-report', 
                         reportFiles: 'index.html', 
                         reportName: 'Playwright HTML Report', 
                         reportTitles: 'Enterprise QA Results'])
        }
    }
}