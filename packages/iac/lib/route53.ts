import * as cdk from '@aws-cdk/core'
import {
  HostedZone,
  PublicHostedZone,
  ZoneDelegationRecord,
} from '@aws-cdk/aws-route53'
import { Vpc } from '@aws-cdk/aws-ec2'

type Route53Props = {
  vpc: Vpc
  domainName: string
  zoneName: string
  localZoneName: string
} & cdk.StackProps

export class Route53Stack extends cdk.Stack {
  hostedZone: HostedZone
  localHostedZone: HostedZone

  constructor(scope: cdk.Construct, id: string, props: Route53Props) {
    super(scope, id, props)

    const vpc = props.vpc
    const domainName = props.domainName
    const zoneName = props.zoneName
    const localZoneName = props.localZoneName

    const hostZone = PublicHostedZone.fromLookup(this, `HostZone`, {
      domainName,
    })

    this.hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName,
    })

    if (!this.hostedZone.hostedZoneNameServers) {
      throw new Error('hostedZoneNameServers is not set')
    }

    new ZoneDelegationRecord(this, 'NS', {
      zone: hostZone,
      recordName: 'cert',
      nameServers: this.hostedZone.hostedZoneNameServers,
      comment: 'Created from cdk',
    })

    this.localHostedZone = new HostedZone(this, 'LocalHostedZone', {
      zoneName: localZoneName,
    })
    this.localHostedZone.addVpc(vpc)
  }
}
