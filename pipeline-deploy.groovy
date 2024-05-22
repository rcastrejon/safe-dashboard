pipeline {
    agent any

    environment {
        PROJECT_WITH_ARTIFACTS = 'safe_dashboard'
    }
    
    stages {
        stage('Prepare') {
            steps {
                copyArtifacts(projectName: "${PROJECT_WITH_ARTIFACTS}", selector: lastSuccessful());
                sh 'scp dist.tar.gz ${SSH_HOST}:~/dist.tar.gz'
            }
        }
        stage('Deploy') {
            steps {
                sh 'ssh ${SSH_HOST} "bash ~/deploy.sh"';
            }
        }
    }
}
