import * as cdk from '@aws-cdk/core'
import { AutoScalingGroup, UpdateType } from '@aws-cdk/aws-autoscaling'
import { InstanceType, Vpc } from '@aws-cdk/aws-ec2'
import { Cluster, EksOptimizedImage, NodeType } from '@aws-cdk/aws-eks'
import {
  AccountRootPrincipal,
  ArnPrincipal,
  CompositePrincipal,
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal
} from '@aws-cdk/aws-iam'

const EKSClusterName = 'ClientCertificateTest'

type EKSProps = {
  vpc: Vpc
} & cdk.StackProps

export class EksStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: EKSProps) {
    super(scope, id, props)

    const vpc = props.vpc

    const clusterAdmin = new Role(this, "AdminRole", {
      roleName: `${EKSClusterName}-AdminRole`,
      assumedBy: new AccountRootPrincipal()
    });

    const cluster = new Cluster(this, 'cluster', {
      clusterName: EKSClusterName,
      vpc,
      vpcSubnets: [
        { subnets: vpc.publicSubnets }, // NOTE: for public load balancer
        { subnets: vpc.privateSubnets },
      ],
      mastersRole: clusterAdmin,
      defaultCapacity: 0,
      defaultCapacityInstance: new InstanceType('t3.micro'),
    })
    cluster.addCapacity('capacity', {
      desiredCapacity: 1,
      instanceType: new InstanceType('t2.small'),
    })

    cdk.Tag.add(this, `kubernetes.io/cluster/${EKSClusterName}`, 'shared', {
      includeResourceTypes: ['AWS::EC2::Subnet'],
    })

    const workerNodeGroup = new AutoScalingGroup(this, 'WorkerNodeASG', {
      vpc: vpc,
      instanceType: new InstanceType('t3.small'),
      machineImage: new EksOptimizedImage({
        nodeType: NodeType.STANDARD,
      }),
      // NOTE: at least one on-demand instance is required
      // to keep at least one Cluster AutoScaler on Cluster.
      minCapacity: 1,
      maxCapacity: 2,
      desiredCapacity: 1,
      updateType: UpdateType.ROLLING_UPDATE,
      vpcSubnets: { subnets: vpc.privateSubnets },
    })

    workerNodeGroup.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'autoscaling:DescribeAutoScalingGroups',
          'autoscaling:DescribeAutoScalingInstances',
          'autoscaling:DescribeLaunchConfigurations',
          'autoscaling:DescribeTags',
          'autoscaling:SetDesiredCapacity',
          'autoscaling:TerminateInstanceInAutoScalingGroup',
          'ec2:DescribeLaunchTemplateVersions',
        ],
        resources: [
          '*', // FIXME:
        ],
      })
    )
    // For kube2iam
    workerNodeGroup.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [
          '*', // FIXME:
        ],
      })
    )

    cdk.Tag.add(this, 'k8s.io/cluster-autoscaler/enabled', 'true', {
      includeResourceTypes: ['AWS::AutoScaling::AutoScalingGroup'],
    })

    cdk.Tag.add(this, `k8s.io/cluster-autoscaler/${EKSClusterName}`, 'owned', {
      includeResourceTypes: ['AWS::AutoScaling::AutoScalingGroup'],
    })

    cluster.addAutoScalingGroup(workerNodeGroup, {
      mapRole: true,
    })

    cluster.awsAuth.addRoleMapping(clusterAdmin, {
      groups: ['system:masters'],
      username: clusterAdmin.roleArn,
    })
    cluster.awsAuth.addRoleMapping(workerNodeGroup.role, {
      groups: ['system:bootstrappers', 'system:nodes'],
      username: 'system:node:{{EC2PrivateDNSName}}',
    })

    new Role(this, 'ClusterAutoscalerRole', {
      roleName: `${EKSClusterName}ClusterAutoscalerRole`,
      assumedBy: new CompositePrincipal(
        new ServicePrincipal('ec2.amazonaws.com'),
        new ArnPrincipal(workerNodeGroup.role.roleArn)
      ),
      inlinePolicies: {
        ExternalSecretsPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'autoscaling:DescribeAutoScalingGroups',
                'autoscaling:DescribeAutoScalingInstances',
                'autoscaling:DescribeLaunchConfigurations',
                'autoscaling:DescribeTags',
                'autoscaling:SetDesiredCapacity',
                'autoscaling:TerminateInstanceInAutoScalingGroup',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    })
  }
}
