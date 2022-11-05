pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo ':: Build Stage Started ::'
        echo '${ENV_VAR}'
        sleep 2
        echo '...next is deploy...'
      }
    }

    stage('Deploy') {
      steps {
        echo ':: Deploy Started :: '
      }
    }

    stage('Test') {
      steps {
        echo ':: Test Started ::'
      }
    }

    stage('Release') {
      steps {
        echo ':: Release Started ::'
      }
    }

  }
  environment {
    ENV_VAR = 'just another env variable'
  }
}