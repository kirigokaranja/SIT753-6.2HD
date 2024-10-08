pipeline {

    agent any

    tools {
        nodejs "NodeJS"
    }

    options {
        datadog(collectLogs: true,
        tags: [
            "env:production",
            "pipeline:build-deploy",
            "project:devops",
            "stage:deploy"
        ])
    }

    environment {
        EMAIL_RECIPIENT = 's223972975@deakin.edu.au'
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        SNYK_API_TOKEN = credentials('snyk-token')
        SERVERLESS_ACCESS_KEY = credentials('serverless-key')
        STAGING_ENVIRONMENT = 'staging'
        PRODUCTION_ENVIRONMENT = 'production'
        SNS_TOPIC_ARN = 'arn:aws:sns:ap-southeast-2:864981747148:S3ErrorAlarms'
        DATADOG_API_KEY = credentials('YOUR_DATADOG_API_KEY')
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
                sh "npm run build"
            }
        }

        stage('Tests'){
            steps {
                echo "Running unit tests using Jest ..."
                sh "npm run test:unit"
                sh "npm run test:unit > unit-test.log 2>&1"
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
                sh "npm run lint"
            }
        }

        stage('Security Scan'){
            steps {
                echo "Perform a security scan on the code using snyk"
                sh "SNYK_TOKEN=$SNYK_API_TOKEN snyk test --json-file-output=snyk-security.log"
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
                echo "Severless S3 Deploy to AWS to staging environment "
                sh "serverless s3sync --stage $STAGING_ENVIRONMENT"
            }
        }

        stage('Integration Tests on Staging'){
            steps {
                echo "Running integrations tests in staging ..."
                sh "npm run test"
            }
        }

        stage('Release'){
            steps {
                echo "Deploy to AWS to production environment `$PRODUCTION_ENVIRONMENT` using serverless"
                sh "serverless s3sync --stage $PRODUCTION_ENVIRONMENT"
            }
        }

    }

}