import * as cdk from '@aws-cdk/core'
import * as ecr from '@aws-cdk/aws-ecr'

type ECRProps = {
  repositoryName: string
} & cdk.StackProps

export class ECRStack extends cdk.Stack {
  readonly repository: ecr.Repository;

  constructor(scope: cdk.Construct, id: string, props: ECRProps) {
    super(scope, id, props)

    const repositoryProps = { repositoryName: props.repositoryName }
    this.repository = new ecr.Repository(
      this,
      'Repository',
      repositoryProps
    )
  }
}
