import {
  WorkloadRequirements,
  SizingSolutionOutput,
  ComputeSizingResult,
  StorageSizingResult,
  NetworkSizingResult,
  SecuritySizingResult,
  ResilienceSizingResult,
  SolutionBOMItem
} from '../types/sizing';

export class SolutionSizingEngine {
  /**
   * Run full multi-pillar sizing calculations and generate BOM
   */
  public static calculateSolution(req: WorkloadRequirements): SizingSolutionOutput {
    const bom: SolutionBOMItem[] = [];

    // 1. Calculate Compute
    let computeResult: ComputeSizingResult | undefined;
    if (req.compute) {
      computeResult = this.sizeCompute(req.compute, bom);
    }

    // 2. Calculate Storage
    let storageResult: StorageSizingResult | undefined;
    if (req.storage) {
      storageResult = this.sizeStorage(req.storage, bom);
    }

    // 3. Calculate Networking
    let networkResult: NetworkSizingResult | undefined;
    if (req.networking) {
      const nodeCount = computeResult?.recommendedNodesCount ?? 4;
      networkResult = this.sizeNetworking(req.networking, nodeCount, bom);
    }

    // 4. Calculate Security
    let securityResult: SecuritySizingResult | undefined;
    if (req.security) {
      securityResult = this.sizeSecurity(req.security, bom);
    }

    // 5. Calculate Cyber Resilience
    let resilienceResult: ResilienceSizingResult | undefined;
    if (req.resilience) {
      resilienceResult = this.sizeResilience(req.resilience, bom);
    }

    return {
      environmentName: req.environmentName,
      timestamp: new Date().toISOString(),
      compute: computeResult,
      storage: storageResult,
      networking: networkResult,
      security: securityResult,
      resilience: resilienceResult,
      billOfMaterials: bom
    };
  }

  private static sizeCompute(
    c: NonNullable<WorkloadRequirements['compute']>,
    bom: SolutionBOMItem[]
  ): ComputeSizingResult {
    const totalVcpus = c.totalVms * c.avgVcpuPerVm;
    const requiredPhysicalCores = Math.ceil(totalVcpus / c.vcpuToPcpuRatio);
    const requiredTotalRamGb = c.totalVms * c.avgRamGbPerVm;

    // Pick standard node configuration (Dell R760 2U default with dual 32-core Xeon Gold = 64 cores, 512GB RAM)
    const coresPerNode = 64;
    const ramGbPerNode = 512;
    const model = c.targetChassisVendor === 'Supermicro' ? 'Supermicro SSG-221P-NECTR24R' : 'Dell PowerEdge R760';

    // Calculate N+X cluster survivability
    const nodesForCores = Math.ceil(requiredPhysicalCores / coresPerNode);
    const nodesForRam = Math.ceil(requiredTotalRamGb / ramGbPerNode);
    const baseNodes = Math.max(nodesForCores, nodesForRam, 2);
    const totalNodes = baseNodes + c.clusterSurvivabilityMargin;

    const usableNodes = totalNodes - c.clusterSurvivabilityMargin;
    const usableClusterCores = usableNodes * coresPerNode;
    const usableClusterRam = usableNodes * ramGbPerNode;

    const cpuHeadroomPercent = Math.round(((usableClusterCores - requiredPhysicalCores) / requiredPhysicalCores) * 100);
    const ramHeadroomPercent = Math.round(((usableClusterRam - requiredTotalRamGb) / requiredTotalRamGb) * 100);

    bom.push({
      category: 'Compute',
      partOrModel: model,
      vendor: c.targetChassisVendor ?? 'Dell',
      quantity: totalNodes,
      description: `2U Rack Server, 2x 32-Core Xeon Gold, ${ramGbPerNode}GB DDR5-5600, Dual 25GbE OCP 3.0, 1+1 Redundant PSU`,
      unitType: 'Node'
    });

    return {
      requiredPhysicalCores,
      requiredTotalRamGb,
      recommendedNodesCount: totalNodes,
      nodeModel: model,
      coresPerNode,
      ramGbPerNode,
      usableClusterCoresWithNPlusOne: usableClusterCores,
      usableClusterRamWithNPlusOne: usableClusterRam,
      cpuHeadroomPercent,
      ramHeadroomPercent
    };
  }

  private static sizeStorage(
    s: NonNullable<WorkloadRequirements['storage']>,
    bom: SolutionBOMItem[]
  ): StorageSizingResult {
    const targetPlatform = s.targetVendor ?? 'Dell';
    let drr = s.expectedDedupeRatio ?? 1.0;
    let parityOverhead = 1.25; // default 25% parity (e.g. DRE dual / RAID6 / 8+2 EC)

    if (targetPlatform === 'Dell') {
      drr = 4.0; // Dell Future-Proof 4:1 DRR guarantee on reducible data
      parityOverhead = 1.22; // PowerStore DRE dual parity
    } else if (targetPlatform === 'Scality') {
      parityOverhead = 1.33; // 9+3 Erasure Coding (33% parity)
    }

    const effectiveNeededTb = s.usableWorkloadCapacityTb;
    const reducibleSourceTb = effectiveNeededTb / drr;
    const rawCapacityWithParityTb = Math.round(reducibleSourceTb * parityOverhead * 1.15); // +15% snapshot reserve

    // 7.68TB or 15.36TB NVMe SSD selection
    const driveSizeTb = 7.68;
    const drivesCount = Math.max(Math.ceil(rawCapacityWithParityTb / driveSizeTb), 6); // Min 6 drives for dual-parity DRE

    if (targetPlatform === 'Dell') {
      bom.push({
        category: 'Storage',
        partOrModel: 'PowerStore 1200T',
        vendor: 'Dell',
        quantity: 1,
        description: `Dual Active-Active Controller Appliance, ${drivesCount}x ${driveSizeTb}TB NVMe SSDs, 4:1 DRR Guarantee`,
        unitType: 'Appliance'
      });
    } else if (targetPlatform === 'Scality') {
      bom.push({
        category: 'Storage',
        partOrModel: 'Scality ARTESCA Appliance Cluster',
        vendor: 'Scality',
        quantity: 3,
        description: `Object Storage Cluster (3-Node Base), S3 Object Lock, 9+3 Erasure Coding`,
        unitType: 'Appliance'
      });
    } else if (targetPlatform === 'Wasabi' || targetPlatform === 'PeaSoup') {
      bom.push({
        category: 'Storage',
        partOrModel: `${targetPlatform} Hot Cloud Storage`,
        vendor: targetPlatform,
        quantity: Math.ceil(effectiveNeededTb),
        description: `Immutable S3 Cloud Repository, Zero Egress & API Fees (${Math.ceil(effectiveNeededTb)} TB Subscription)`,
        unitType: 'TB_Subscription'
      });
    }

    return {
      targetPlatform: targetPlatform === 'Dell' ? 'Dell PowerStore' : targetPlatform,
      usableCapacityRequiredTb: effectiveNeededTb,
      effectiveCapacityWithDedupeTb: Math.round(reducibleSourceTb * drr),
      rawCapacityNeededWithParityTb: rawCapacityWithParityTb,
      recommendedDrivesCount: drivesCount,
      driveSizeTb,
      parityOverheadRatio: parityOverhead,
      effectiveDataReductionRatio: drr,
      immutabilityCompliant: true
    };
  }

  private static sizeNetworking(
    n: NonNullable<WorkloadRequirements['networking']>,
    nodeCount: number,
    bom: SolutionBOMItem[]
  ): NetworkSizingResult {
    const portsPerNode = n.dualHomedServers ? 2 : 1;
    const storagePorts = 4; // 2x storage controller redundant uplinks
    const total25GDownlinkPortsRequired = (nodeCount * portsPerNode) + storagePorts;

    // A single 48-port SFP28 leaf switch provides 48x 25G. We recommend an HA pair (2 leaf switches).
    const leafSwitchesNeeded = 2;
    const spineSwitchesNeeded = n.spineLeafFabric ? 2 : 0;

    // 48x 25G downlinks = 1.2Tbps per leaf. 4x 100G uplinks = 400Gbps (3:1 oversubscription ratio)
    const achievedOversubscriptionRatio = 3.0;
    const total100GUplinkPortsRequired = spineSwitchesNeeded > 0 ? leafSwitchesNeeded * 4 : 0;

    const vendor = n.targetSwitchVendor ?? 'Dell';
    const leafModel = vendor === 'Arista' ? 'Arista 7050SX3-48YC8' : 'PowerSwitch S5248F-ON';
    const spineModel = vendor === 'Arista' ? 'Arista 7060CX-32S' : 'PowerSwitch Z9264F-ON';

    bom.push({
      category: 'Networking',
      partOrModel: leafModel,
      vendor: vendor,
      quantity: leafSwitchesNeeded,
      description: `48-Port 25GbE SFP28, 6x 100GbE QSFP28 ToR Leaf Switch Pair, MLAG / VLT HA`,
      unitType: 'Switch'
    });

    if (spineSwitchesNeeded > 0) {
      bom.push({
        category: 'Networking',
        partOrModel: spineModel,
        vendor: vendor,
        quantity: spineSwitchesNeeded,
        description: `32/64-Port 100GbE QSFP28 Spine Switch Pair, Non-Blocking Fabric`,
        unitType: 'Switch'
      });
    }

    // Cabling
    const dac25gCount = total25GDownlinkPortsRequired;
    const dac100gCount = total100GUplinkPortsRequired + 4; // +4 for inter-switch interconnects
    bom.push({
      category: 'Networking',
      partOrModel: '25GbE SFP28 Direct Attach Copper (DAC) Cables (2m/3m)',
      vendor: vendor,
      quantity: dac25gCount,
      description: `Passive DAC cabling for server & storage redundant links`,
      unitType: 'Cable'
    });

    return {
      leafSwitchesNeeded,
      spineSwitchesNeeded,
      total25GDownlinkPortsRequired,
      total100GUplinkPortsRequired,
      achievedOversubscriptionRatio,
      cablesRequired: {
        dac25gCount,
        dac100gCount
      },
      recommendedLeafModel: leafModel,
      recommendedSpineModel: spineModel
    };
  }

  private static sizeSecurity(
    sec: NonNullable<WorkloadRequirements['security']>,
    bom: SolutionBOMItem[]
  ): SecuritySizingResult {
    const marginMultiplier = 1 + (sec.headroomSafetyMarginPercent / 100);
    const requiredThroughputWithMarginGbps = sec.peakIngressEgressBandwidthGbps * marginMultiplier;

    const vendor = sec.targetFirewallVendor ?? 'Fortinet';
    let model = 'FortiGate 200F';
    let ratedThroughput = 3.0; // Threat prevention rating

    if (vendor === 'Fortinet') {
      if (requiredThroughputWithMarginGbps > 3.0) {
        model = 'FortiGate 600F';
        ratedThroughput = 9.5;
      } else {
        model = 'FortiGate 200F';
        ratedThroughput = 3.0;
      }
    } else if (vendor === 'Check Point') {
      model = 'Quantum 6600';
      ratedThroughput = 3.7;
    } else if (vendor === 'Sophos') {
      model = 'Sophos XGS 2300';
      ratedThroughput = 1.4;
    }

    const applianceCount = sec.highAvailabilityPair ? 2 : 1;
    const inspectionMargin = Math.round(((ratedThroughput - requiredThroughputWithMarginGbps) / ratedThroughput) * 100);

    bom.push({
      category: 'Security',
      partOrModel: model,
      vendor: vendor,
      quantity: applianceCount,
      description: `NGFW / Threat Prevention Appliance (${sec.highAvailabilityPair ? 'Active-Passive HA Pair' : 'Single Appliance'}), SSL/TLS Inspection`,
      unitType: 'Appliance'
    });

    return {
      firewallModel: model,
      ratedThroughputGbps: ratedThroughput,
      requiredThroughputWithMarginGbps,
      inspectionThroughputMarginPercent: inspectionMargin,
      applianceCount,
      haArchitecture: sec.highAvailabilityPair ? 'Active-Passive HA Pair (Sync / Heartbeat)' : 'Standalone'
    };
  }

  private static sizeResilience(
    r: NonNullable<WorkloadRequirements['resilience']>,
    bom: SolutionBOMItem[]
  ): ResilienceSizingResult {
    const vendor = r.targetResilienceVendor ?? 'Veeam';
    let licensedUnits = 0;
    let metric = 'VUL_Instance';

    if (vendor === 'Veeam') {
      // 1 VUL per VM, 1 VUL per physical server, 1 VUL per 500GB NAS
      const nasInstances = Math.ceil(r.protectedNasCapacityTb / 0.5);
      licensedUnits = r.protectedVmsCount + r.protectedPhysicalServersCount + nasInstances;
      metric = 'Veeam Universal License (VUL) Instances';
    } else if (vendor === 'Commvault') {
      // Front-End TB calculation
      const estimatedSourceDataTb = (r.protectedVmsCount * 0.1) + (r.protectedPhysicalServersCount * 0.3) + r.protectedNasCapacityTb;
      licensedUnits = Math.ceil(estimatedSourceDataTb);
      metric = 'Front-End Terabytes (FETB)';
    } else if (vendor === 'Cohesity') {
      licensedUnits = Math.ceil((r.protectedVmsCount * 0.1) + r.protectedNasCapacityTb);
      metric = 'Protected Usable TB Consumption';
    }

    // Backup Repository sizing: Full backup weekly + daily differentials
    const dedupe = r.expectedBackupDedupeRatio ?? 2.8;
    const estimatedBaseDataTb = ((r.protectedVmsCount * 0.1) + (r.protectedPhysicalServersCount * 0.3) + r.protectedNasCapacityTb);
    const postDedupeFullTb = estimatedBaseDataTb / dedupe;
    const dailyChangeTb = postDedupeFullTb * 0.05; // 5% daily change rate
    const localRepoTb = Math.ceil((postDedupeFullTb * 2) + (dailyChangeTb * r.dailyRetentionDays));
    const cloudArchiveTb = Math.ceil(postDedupeFullTb * (r.monthlyRetentionMonths + (r.yearlyRetentionYears * 12)) * 0.5);

    // Proxy sizing (1 core / 2GB per 10 VMs)
    const recommendedProxyCpuCores = Math.max(Math.ceil(r.protectedVmsCount / 10), 4);
    const recommendedProxyRamGb = recommendedProxyCpuCores * 2;

    bom.push({
      category: 'Resilience',
      partOrModel: `${vendor} Cyber Resilience Suite`,
      vendor: vendor,
      quantity: licensedUnits,
      description: `Enterprise Backup & Recovery Protection (${licensedUnits} ${metric})`,
      unitType: 'License'
    });

    return {
      resiliencePlatform: vendor,
      licensingMetric: metric,
      licensedUnitsRequired: licensedUnits,
      localBackupRepositorySizeNeededTb: localRepoTb,
      cloudArchiveSizeNeededTb: cloudArchiveTb,
      recommendedProxyCpuCores,
      recommendedProxyRamGb,
      immutabilityMethod: r.immutabilityTarget
    };
  }
}
