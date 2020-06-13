import * as cdk from '@aws-cdk/core'
import * as ecr from '@aws-cdk/aws-ecr'

type ECRProps = {
  repositoryNames: Array<string>
} & cdk.StackProps

export class ECRStack extends cdk.Stack {
  readonly repositories: Record<string, ecr.Repository>;

  constructor(scope: cdk.Construct, id: string, props: ECRProps) {
    super(scope, id, props)

    this.repositories = {}

    props.repositoryNames.forEach((repositoryName, i) => {
      const repository = new ecr.Repository(
        this,
        `Repository${i+1}`,
        {
          repositoryName
        }
      )
      this.repositories[repositoryName] = repository
    })
  }
}
