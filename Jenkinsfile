pipeline {

    agent any

    tools {
        nodejs "NodeJS"
    }

    environment {
        EMAIL_RECIPIENT = 's223972975@deakin.edu.au'
        S3_BUCKET_STAGING = 'professional-practice-staging'
        S3_BUCKET_PRODUCTION = 'sharon-professional-pratice-in-it'
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        SNYK_API_TOKEN = credentials('snyk-token')
    }

    stages {
        stage('Install Dependencies'){
            steps {
                echo "Install the code packages ..."
                sh 'npm install'
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
                sh 'npm run test:unit > unit-test.log 2>&1'
            }

            post {
                always {
                    emailext attachmentsPattern: 'unit-test.log',
                    to: "${env.EMAIL_RECIPIENT}",
                    subject: "Unit Test ${env.JOB_NAME} #${env.BUILD_NUMBER} Status email",
                    body:  """

                        The Jenkins Pipeline Unit Tests stage has finished running.

                        Find attached logs for more details.
                        """
                }
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
                sh 'npm install -g snyk'
                sh 'SNYK_TOKEN=$SNYK_API_TOKEN snyk test --json-file-output=snyk-security.log'
            }

             post {
                always {
                    emailext attachmentsPattern: 'snyk-security.log',
                    to: "${env.EMAIL_RECIPIENT}",
                    subject: "Security Scan ${env.JOB_NAME} Build #${env.BUILD_NUMBER} Status email",
                    body:  """

                        The Jenkins Pipeline Security scan stage has finished running

                        Find attached logs for more details.
                        """
                }
            }
        }

        stage('Deploy to Staging'){
            steps {
                echo "Deploy to AWS to staging environment "
                sh '''
                aws s3 sync ./dist s3://$S3_BUCKET_STAGING --delete
                '''
            }
        }

        stage('Integration Tests on Staging'){
            steps {
                echo "Running integrations tests in staging using Jest ..."
                sh 'npm run test'
            }
        }

        stage('Deploy to Production'){
            steps {
                echo "Deploy to AWS to production environment `$PRODUCTION_ENVIRONMENT` using AWS CloudFormation"
            }
        }
    }
}