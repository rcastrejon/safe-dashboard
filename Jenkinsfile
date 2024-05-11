pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'pnpm install'
            }
        }
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'pnpm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing....'
                sh 'pnpm run test'
            }
        }
    }

    post {
        success {
            sh 'tar czf dist.tar.gz dist/'
            archiveArtifacts artifacts: 'dist.tar.gz', fingerprint: true, onlyIfSuccessful: true
            build job: "${DEPLOY_PIPELINE}", parameters: [string(name: 'TAG', value: "${env.BUILD_NUMBER}")], propagate: true, wait: true
        }
    }
}
