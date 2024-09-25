pipeline {

    agent any

    environment {
        DIRECTORY_PATH = '/var/www/html/deakin-uni/ui'
        STAGING_ENVIRONMENT = 'STAGING'
        PRODUCTION_ENVIRONMENT = 'SHARON'
        EMAIL_RECIPIENT = 's223972975@deakin.edu.au'
    }

    stages {
        stage('Build'){
            steps {
                echo "Fetch source Code from directory path `$DIRECTORY_PATH` "
                echo "Install and Build the code packages using a build automation tool like npm or webhook"
            }
        }

        stage('Tests'){
            steps {
                script {
                    def log = sh(script: """
                        echo "Unit tests are performed and usually cover a single function and cover a small portion of the overall code. Automation tools used for this include Jest"
                        echo "Integration tests involve testing the interaction between different components. Automation tools used for this include Cypress."
                    """, returnStdout: true).trim()
                    writeFile file: 'tests.log', text: log
                }
            }
            post {
                always {
                    emailext attachmentsPattern: 'tests.log',
                    to: "${env.EMAIL_RECIPIENT}",
                    subject: "Tests Results ${env.JOB_NAME} Build #${env.BUILD_NUMBER} Status email",
                    body:  """

                        The Jenkins Pipeline Tests stage has finished running

                        - Build Number: $BUILD_NUMBER
                        - Status: $currentBuild.currentResult

                        Find attached logs for more details.
                        """
                }
            }

        }

        stage('Code Analysis'){
            steps {
                echo "Analyze the code using SonarQube to ensure it meets industry standards."
            }
        }

        stage('Security Scan'){
            steps {
                echo "Perform a security scan on the code using OWASP to identify any vulnerabilities"
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

    post {
        always {
            emailext attachLog: true,
            to: 's223972975@deakin.edu.au',
            subject: "Pipeline Execution Completed",
            body: "The pipeline '${env.JOB_NAME}' Build #${env.BUILD_NUMBER} execution has completed."
        }
    }
}