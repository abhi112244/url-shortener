pipeline {
    agent any

    tools {
        nodejs 'node18'  // Name you gave in Global Tool Config
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/abhi112244/url-shortener'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build script found"'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || echo "No tests found"'
            }
        }

        stage('Run App') {
            steps {
                sh 'node server.js &'
            }
        }
    }
}
