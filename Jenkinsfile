pipeline {

    agent any

    environment {
        DIRECTORY_PATH = '/var/www/html/deakin-uni/ui'
        STAGING_ENVIRONMENT = 'STAGING'
        PRODUCTION_ENVIRONMENT = 'SHARON'
        EMAIL_RECIPIENT = 's223972975@deakin.edu.au'

        NODE_VERSION = '20.x'

        // Your S3 bucket name
        S3_BUCKET = 'your-bucket-name'

        // Reference AWS credentials stored in Jenkins
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    }

    stages {
        stage('Install Dependencies'){
            steps {
            echo "Install the code packages ..."
                script {
                    def nodeHome = tool name: 'NodeJS', type: 'NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                    sh 'npm install'
                }
            }
        }

        stage('Build'){
            steps {
                echo " Build the code packages ..."
                sh 'npm run build'
            }
        }

        stage('Tests'){
            steps {
                echo "Running unit tests using Jest ..."
                sh 'npm run test:unit'
            }
        }

        stage('Code Analysis'){
            steps {
                echo "Analyze the code using Eslint ..."
                sh 'npm run lint'
            }
        }

        stage('Security Scan'){
            steps {
                echo "Perform a security scan on the code using snyk"
                sh 'echo "Perform a security scan using OWASP ..." > security-scan.log'
            }

             post {
                always {
                    emailext attachmentsPattern: 'security-scan.log',
                    to: "${env.EMAIL_RECIPIENT}",
                    subject: "Security Scan ${env.JOB_NAME} Build #${env.BUILD_NUMBER} Status email",
                    body:  """

                        The Jenkins Pipeline Security scan stage has finished running

                        - Build Number: $BUILD_NUMBER
                        - Status: $currentBuild.currentResult

                        Find attached logs for more details.
                        """
                }
            }
        }

        stage('Deploy to Staging'){
            steps {
                echo "Deploy to application to staging environment `$STAGING_ENVIRONMENT` using AWS CloudFormation or Azure Storage"
            }
        }

        stage('Integration Tests on Staging'){
            steps {
                echo "Using Selenium to run integration tests on the staging environment to ensure the application functions as expected in a production-like environment"
            }
        }

        stage('Deploy to Production'){
            steps {
                echo "Deploy to application to production environment `$PRODUCTION_ENVIRONMENT` using AWS CloudFormation"
            }
        }
    }
}