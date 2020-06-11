import * as cdk from '@aws-cdk/core'
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2'
import * as wafv2 from '@aws-cdk/aws-wafv2'

type WAFProps = {
  loadBalancerArn: string
  securityGroupId: string
} & cdk.StackProps

export class WAFStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WAFProps) {
    super(scope, id, props)

    const webACL = new wafv2.CfnWebACL(this, 'WebACL', {
      defaultAction: {
        allow: {}
      },
      name: 'UnnamedWaf', // TODO
      rules: [],
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: false,
        metricName: 'ExampleWebACLMetric',
        sampledRequestsEnabled: false
      }
    })

    const loadBalancerArn = props.loadBalancerArn
    const securityGroupId = props.securityGroupId

    const alb = elbv2.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(this, 'ALB', {
      loadBalancerArn,
      securityGroupId
    })

    new wafv2.CfnWebACLAssociation(this, 'WebACLAssociation', {
      webAclArn: webACL.attrArn,
      resourceArn: alb.loadBalancerArn,
    })
  }
}
