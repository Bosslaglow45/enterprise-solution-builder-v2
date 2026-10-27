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
  public static calculateSolution(req: WorkloadRequirements): SizingSolutionOutput {
    const bom: SolutionBOMItem[] = [];
    const term = req.contractTermYears || 3;
    const sla = req.supportSla || 'Mission_Critical_4Hr_24x7';

    let computeResult: ComputeSizingResult | undefined;
    if (req.compute) {
      computeResult = this.sizeCompute(req.compute, term, sla, bom);
    }

    let storageResult: StorageSizingResult | undefined;
    if (req.storage) {
      storageResult = this.sizeStorage(req.storage, term, sla, bom);
    }

    let networkResult: NetworkSizingResult | undefined;
    if (req.networking) {
      const nodeCount = computeResult?.recommendedNodesCount ?? 4;
      networkResult = this.sizeNetworking(req.networking, nodeCount, term, sla, bom);
    }

    let securityResult: SecuritySizingResult | undefined;
    if (req.security) {
      securityResult = this.sizeSecurity(req.security, term, sla, bom);
    }

    let resilienceResult: ResilienceSizingResult | undefined;
    if (req.resilience) {
      resilienceResult = this.sizeResilience(req.resilience, term, sla, bom);
    }

    return {
      environmentName: req.environmentName,
      timestamp: new Date().toISOString(),
      contractTermYears: term,
      supportSla: sla,
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
    term: number,
    sla: string,
    bom: SolutionBOMItem[]
  ): ComputeSizingResult {
    const totalVcpus = c.totalVms * c.avgVcpuPerVm;
    const requiredPhysicalCores = Math.ceil(totalVcpus / c.vcpuToPcpuRatio);
    const requiredTotalRamGb = c.totalVms * c.avgRamGbPerVm;

    const coresPerNode = 64;
    const ramGbPerNode = 512;
    const isDell = c.targetChassisVendor !== 'Supermicro';
    const model = isDell ? 'Dell PowerEdge R760' : 'Supermicro SSG-221P-NECTR24R';
    const baseSku = isDell ? '210-BDFY' : 'SYS-221P-NECTR24R';

    const baseNodes = Math.max(Math.ceil(requiredPhysicalCores / coresPerNode), Math.ceil(requiredTotalRamGb / ramGbPerNode), 2);
    const totalNodes = baseNodes + c.clusterSurvivabilityMargin;

    const usableNodes = totalNodes - c.clusterSurvivabilityMargin;
    const usableClusterCores = usableNodes * coresPerNode;
    const usableClusterRam = usableNodes * ramGbPerNode;

    const cpuHeadroomPercent = Math.round(((usableClusterCores - requiredPhysicalCores) / requiredPhysicalCores) * 100);
    const ramHeadroomPercent = Math.round(((usableClusterRam - requiredTotalRamGb) / requiredTotalRamGb) * 100);

    // Node Chassis
    bom.push({
      category: 'Compute',
      partOrModel: model,
      vendor: isDell ? 'Dell' : 'Supermicro',
      orderSku: baseSku,
      quantity: totalNodes,
      description: `2U Rack Server, 2x 32-Core Xeon Gold 6448Y (SKU: 338-CHTT), ${ramGbPerNode}GB DDR5-5600 (8x 64GB SKU: 370-AGVP), BOSS-N1 Dual M.2 NVMe RAID1 (SKU: 403-BCMN), iDRAC9 Datacenter (SKU: 528-CRWS)`,
      unitType: 'Node',
      termYears: term
    });

    // Support SLA Pack
    if (isDell) {
      const supportSku = term === 5 ? '865-9803' : '865-9801';
      bom.push({
        category: 'Compute',
        partOrModel: 'Dell ProSupport Plus 24x7 4-Hour Mission Critical',
        vendor: 'Dell',
        orderSku: supportSku,
        quantity: totalNodes,
        description: `${term}-Year Mission Critical 4-Hour On-Site Support with Collaborative Third-Party Assistance`,
        unitType: 'Service_Pack',
        termYears: term,
        supportLevel: 'Mission_Critical_4Hr_24x7'
      });
    }

    return {
      requiredPhysicalCores,
      requiredTotalRamGb,
      recommendedNodesCount: totalNodes,
      nodeModel: model,
      nodeBaseSku: baseSku,
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
    term: number,
    sla: string,
    bom: SolutionBOMItem[]
  ): StorageSizingResult {
    const target = s.targetVendor ?? 'Dell';
    let drr = s.expectedDedupeRatio ?? 1.0;
    let parityOverhead = 1.25;

    if (target === 'Dell') {
      drr = 4.0; // 4:1 DRR
      parityOverhead = 1.22;
    } else if (target === 'Scality') {
      parityOverhead = 1.33;
    }

    const effectiveNeededTb = s.usableWorkloadCapacityTb;
    const reducibleSourceTb = effectiveNeededTb / drr;
    const rawCapacityWithParityTb = Math.round(reducibleSourceTb * parityOverhead * 1.15);

    const driveSizeTb = 7.68;
    const drivesCount = Math.max(Math.ceil(rawCapacityWithParityTb / driveSizeTb), 6);
    const drivePackSku = '400-BLXS'; // Dell 7.68TB NVMe SSD pack

    if (target === 'Dell') {
      bom.push({
        category: 'Storage',
        partOrModel: 'PowerStore 1200T Base Appliance',
        vendor: 'Dell',
        orderSku: '210-AXEJ',
        quantity: 1,
        description: `Dual Active-Active NVMe Storage Array, 4x 25GbE Optical Mezzanine (SKU: 384-BDZS), Dynamic Resiliency Engine dual-parity`,
        unitType: 'Appliance',
        termYears: term
      });

      bom.push({
        category: 'Storage',
        partOrModel: 'PowerStore 7.68TB NVMe SSD Drive Pack',
        vendor: 'Dell',
        orderSku: drivePackSku,
        quantity: Math.ceil(drivesCount / 6),
        description: `${drivesCount}x 7.68TB NVMe SSDs configured with Dell Future-Proof 4:1 DRR Guarantee`,
        unitType: 'Appliance'
      });

      const supportSku = term === 5 ? '865-9834' : '865-9832';
      bom.push({
        category: 'Storage',
        partOrModel: 'Dell ProSupport Plus for PowerStore',
        vendor: 'Dell',
        orderSku: supportSku,
        quantity: 1,
        description: `${term}-Year 24x7 4-Hour On-Site Support with Proactive Predictive Monitoring`,
        unitType: 'Service_Pack',
        termYears: term,
        supportLevel: 'Mission_Critical_4Hr_24x7'
      });
    } else if (target === 'Scality') {
      const artSku = term === 3 ? 'ART-LIC-SUB-100T-3Y' : 'ART-LIC-SUB-100T-1Y';
      bom.push({
        category: 'Storage',
        partOrModel: 'Scality ARTESCA Software Subscription',
        vendor: 'Scality',
        orderSku: artSku,
        quantity: Math.ceil(effectiveNeededTb / 100),
        description: `${term}-Year S3 Object Storage Subscription (${effectiveNeededTb} TB), S3 Object Lock, 9+3 Erasure Coding`,
        unitType: 'License',
        termYears: term
      });
    } else if (target === 'Wasabi') {
      const wasabiSku = term === 3 ? 'WASABI-RCS-100T-3Y' : 'WASABI-RCS-25T-1Y';
      bom.push({
        category: 'Storage',
        partOrModel: 'Wasabi Reserved Capacity Storage (RCS)',
        vendor: 'Wasabi',
        orderSku: wasabiSku,
        quantity: Math.ceil(effectiveNeededTb / 25),
        description: `${term}-Year Reserved Cloud Object Storage Block (${Math.ceil(effectiveNeededTb)} TB), $0 Egress & $0 API Calls`,
        unitType: 'TB_Subscription',
        termYears: term
      });
    } else if (target === 'PeaSoup') {
      bom.push({
        category: 'Storage',
        partOrModel: 'PeaSoup Sovereign Cloud S3 Repository',
        vendor: 'PeaSoup',
        orderSku: 'PS-S3-UK-10T-1Y',
        quantity: Math.ceil(effectiveNeededTb / 10),
        description: `${term}-Year UK Sovereign S3 Immutable Storage (${Math.ceil(effectiveNeededTb)} TB), Zero Egress Fees`,
        unitType: 'TB_Subscription',
        termYears: term
      });
    }

    return {
      targetPlatform: target === 'Dell' ? 'Dell PowerStore' : target,
      usableCapacityRequiredTb: effectiveNeededTb,
      effectiveCapacityWithDedupeTb: Math.round(reducibleSourceTb * drr),
      rawCapacityNeededWithParityTb: rawCapacityWithParityTb,
      recommendedDrivesCount: drivesCount,
      driveSizeTb,
      drivePackSku,
      parityOverheadRatio: parityOverhead,
      effectiveDataReductionRatio: drr,
      immutabilityCompliant: true
    };
  }

  private static sizeNetworking(
    n: NonNullable<WorkloadRequirements['networking']>,
    nodeCount: number,
    term: number,
    sla: string,
    bom: SolutionBOMItem[]
  ): NetworkSizingResult {
    const portsPerNode = n.dualHomedServers ? 2 : 1;
    const total25GDownlinkPortsRequired = (nodeCount * portsPerNode) + 4;

    const leafSwitchesNeeded = 2;
    const spineSwitchesNeeded = n.spineLeafFabric ? 2 : 0;
    const total100GUplinkPortsRequired = spineSwitchesNeeded > 0 ? leafSwitchesNeeded * 4 : 0;

    const isArista = n.targetSwitchVendor === 'Arista';
    const leafModel = isArista ? 'Arista 7050SX3-48YC8' : 'PowerSwitch S5248F-ON';
    const spineModel = isArista ? 'Arista 7060CX-32S' : 'PowerSwitch Z9264F-ON';

    const leafSku = isArista ? 'DCS-7050SX3-48YC8-F' : '210-ARXQ';
    const spineSku = isArista ? 'DCS-7060CX-32S-F' : '210-ARYB';
    const dac25gSku = isArista ? 'CAB-SFP28-3M' : '470-ACFD';
    const dac100gSku = isArista ? 'CAB-Q-Q-100G-3M' : '470-ABQZ';

    bom.push({
      category: 'Networking',
      partOrModel: leafModel,
      vendor: isArista ? 'Arista' : 'Dell',
      orderSku: leafSku,
      quantity: leafSwitchesNeeded,
      description: `48x 25GbE SFP28, 6x 100GbE QSFP28 Data Centre ToR Leaf Switch Pair, Dual AC, Front-to-Rear Airflow, MLAG/VLT`,
      unitType: 'Switch',
      termYears: term
    });

    if (spineSwitchesNeeded > 0) {
      bom.push({
        category: 'Networking',
        partOrModel: spineModel,
        vendor: isArista ? 'Arista' : 'Dell',
        orderSku: spineSku,
        quantity: spineSwitchesNeeded,
        description: `32/64-Port 100GbE QSFP28 Spine Switch Pair, Non-Blocking Wire-Speed Fabric`,
        unitType: 'Switch',
        termYears: term
      });
    }

    // Cabling
    const dac25gCount = total25GDownlinkPortsRequired;
    const dac100gCount = total100GUplinkPortsRequired + 4;

    bom.push({
      category: 'Networking',
      partOrModel: '25GbE SFP28 Direct Attach Copper (DAC) Cable 3m',
      vendor: isArista ? 'Arista' : 'Dell',
      orderSku: dac25gSku,
      quantity: dac25gCount,
      description: `Passive 25G DAC cabling for server compute & storage redundant downlinks`,
      unitType: 'Cable'
    });

    if (dac100gCount > 0) {
      bom.push({
        category: 'Networking',
        partOrModel: '100GbE QSFP28 Direct Attach Copper (DAC) Cable 3m',
        vendor: isArista ? 'Arista' : 'Dell',
        orderSku: dac100gSku,
        quantity: dac100gCount,
        description: `Passive 100G DAC cabling for spine uplinks and inter-switch link (ISL) bonding`,
        unitType: 'Cable'
      });
    }

    return {
      leafSwitchesNeeded,
      spineSwitchesNeeded,
      leafSku,
      spineSku,
      total25GDownlinkPortsRequired,
      total100GUplinkPortsRequired,
      achievedOversubscriptionRatio: 3.0,
      cablesRequired: {
        dac25gCount,
        dac100gCount,
        dac25gSku,
        dac100gSku
      },
      recommendedLeafModel: leafModel,
      recommendedSpineModel: spineModel
    };
  }

  private static sizeSecurity(
    sec: NonNullable<WorkloadRequirements['security']>,
    term: number,
    sla: string,
    bom: SolutionBOMItem[]
  ): SecuritySizingResult {
    const marginMultiplier = 1 + (sec.headroomSafetyMarginPercent / 100);
    const requiredThroughput = sec.peakIngressEgressBandwidthGbps * marginMultiplier;
    const vendor = sec.targetFirewallVendor ?? 'Fortinet';

    let model = 'FortiGate 200F';
    let hwSku = 'FG-200F';
    let bundleSku = term === 3 ? 'FC-10-00200-950-02-36' : 'FC-10-00200-950-02-12';
    let ratedThroughput = 3.0;

    if (vendor === 'Fortinet') {
      if (requiredThroughput > 3.0) {
        model = 'FortiGate 600F';
        hwSku = 'FG-600F';
        bundleSku = term === 3 ? 'FC-10-00600-950-02-36' : 'FC-10-00600-950-02-12';
        ratedThroughput = 9.5;
      }
    } else if (vendor === 'Check Point') {
      model = 'Quantum 6600';
      hwSku = 'CPAP-SG6600-SNBT-2Y';
      bundleSku = term === 3 ? 'CPAP-SG6600-SNBC-3Y' : 'CPAP-SG6600-SNBT-2Y';
      ratedThroughput = 3.7;
    } else if (vendor === 'Sophos') {
      model = 'Sophos XGS 2300';
      hwSku = 'XB231CSAA';
      bundleSku = term === 3 ? 'XB233ETPA' : 'XB231ETPA';
      ratedThroughput = 1.4;
    }

    const applianceCount = sec.highAvailabilityPair ? 2 : 1;
    const inspectionMargin = Math.round(((ratedThroughput - requiredThroughput) / ratedThroughput) * 100);

    // Hardware Appliances
    bom.push({
      category: 'Security',
      partOrModel: model,
      vendor: vendor,
      orderSku: hwSku,
      quantity: applianceCount,
      description: `1U Next-Gen Firewall Appliance (${sec.highAvailabilityPair ? 'Active-Passive HA Pair' : 'Standalone'})`,
      unitType: 'Appliance',
      termYears: term
    });

    // Threat Prevention Bundles
    bom.push({
      category: 'Security',
      partOrModel: `${vendor} Threat Protection & Support Subscription`,
      vendor: vendor,
      orderSku: bundleSku,
      quantity: applianceCount,
      description: `${term}-Year Unified Threat Protection (UTP / SandBlast) Subscription with 24x7 4-Hour Support`,
      unitType: 'License',
      termYears: term,
      supportLevel: 'Mission_Critical_4Hr_24x7'
    });

    return {
      firewallModel: model,
      applianceHardwareSku: hwSku,
      subscriptionBundleSku: bundleSku,
      ratedThroughputGbps: ratedThroughput,
      requiredThroughputWithMarginGbps: requiredThroughput,
      inspectionThroughputMarginPercent: inspectionMargin,
      applianceCount,
      haArchitecture: sec.highAvailabilityPair ? 'Active-Passive HA Clustering (Heartbeat Sync)' : 'Standalone'
    };
  }

  private static sizeResilience(
    r: NonNullable<WorkloadRequirements['resilience']>,
    term: number,
    sla: string,
    bom: SolutionBOMItem[]
  ): ResilienceSizingResult {
    const vendor = r.targetResilienceVendor ?? 'Veeam';
    const tier = r.tierLevel ?? 'Premium';

    let primarySku = 'V-VULPRM-0I-SU3YP-00';
    let licensedUnits = 0;
    let metric = 'VUL_Instance';

    if (vendor === 'Veeam') {
      const nasInstances = Math.ceil(r.protectedNasCapacityTb / 0.5);
      licensedUnits = r.protectedVmsCount + r.protectedPhysicalServersCount + nasInstances;
      metric = 'Veeam Universal License (VUL) Instances';

      if (tier === 'Premium') {
        primarySku = term === 5 ? 'V-VULPRM-0I-SU5YP-00' : (term === 3 ? 'V-VULPRM-0I-SU3YP-00' : 'V-VULPRM-0I-SU1YP-00');
      } else if (tier === 'Advanced') {
        primarySku = term === 5 ? 'V-VULADV-0I-SU5YP-00' : (term === 3 ? 'V-VULADV-0I-SU3YP-00' : 'V-VULADV-0I-SU1YP-00');
      } else {
        primarySku = 'V-VULFND-0I-SU1YP-00';
      }

      bom.push({
        category: 'Resilience',
        partOrModel: `Veeam Data Platform ${tier}`,
        vendor: 'Veeam',
        orderSku: primarySku,
        quantity: licensedUnits,
        description: `${term}-Year VUL Subscription for ${licensedUnits} Workloads (${r.protectedVmsCount} VMs, ${r.protectedPhysicalServersCount} Physical, ${r.protectedNasCapacityTb}TB NAS) with 24x7 Production Support`,
        unitType: 'License',
        termYears: term,
        supportLevel: 'Mission_Critical_4Hr_24x7'
      });

      if (r.protectedM365UsersCount && r.protectedM365UsersCount > 0) {
        const m365Sku = term === 3 ? 'P-VBOM36-0U-SU3YP-00' : 'P-VBOM36-0U-SU1YP-00';
        bom.push({
          category: 'Resilience',
          partOrModel: 'Veeam Backup for Microsoft 365',
          vendor: 'Veeam',
          orderSku: m365Sku,
          quantity: r.protectedM365UsersCount,
          description: `${term}-Year M365 Protection Subscription for ${r.protectedM365UsersCount} Users (Exchange, SharePoint, Teams)`,
          unitType: 'License',
          termYears: term
        });
      }
    } else if (vendor === 'Commvault') {
      const estimatedSourceDataTb = (r.protectedVmsCount * 0.1) + (r.protectedPhysicalServersCount * 0.3) + r.protectedNasCapacityTb;
      licensedUnits = Math.ceil(estimatedSourceDataTb);
      metric = 'Front-End Terabytes (FETB)';
      primarySku = term === 3 ? 'CV-BR-ADV-1T-3Y' : 'CV-BR-ADV-1T-1Y';

      bom.push({
        category: 'Resilience',
        partOrModel: 'Commvault Complete Backup & Recovery Advanced',
        vendor: 'Commvault',
        orderSku: primarySku,
        quantity: licensedUnits,
        description: `${term}-Year Front-End Terabyte Subscription (${licensedUnits} FETB)`,
        unitType: 'License',
        termYears: term
      });
    } else if (vendor === 'Cohesity') {
      licensedUnits = Math.ceil((r.protectedVmsCount * 0.1) + r.protectedNasCapacityTb);
      metric = 'Protected Usable TB Consumption';
      primarySku = term === 3 ? 'CP-DP-SW-TB-3Y' : 'CP-DP-SW-TB-1Y';

      bom.push({
        category: 'Resilience',
        partOrModel: 'Cohesity DataProtect Software Subscription',
        vendor: 'Cohesity',
        orderSku: primarySku,
        quantity: licensedUnits,
        description: `${term}-Year Cohesity SpanFS Capacity Subscription (${licensedUnits} TB)`,
        unitType: 'License',
        termYears: term
      });
    }

    const estimatedBaseDataTb = ((r.protectedVmsCount * 0.1) + (r.protectedPhysicalServersCount * 0.3) + r.protectedNasCapacityTb);
    const postDedupeFullTb = estimatedBaseDataTb / 2.8;
    const dailyChangeTb = postDedupeFullTb * 0.05;
    const localRepoTb = Math.ceil((postDedupeFullTb * 2) + (dailyChangeTb * r.dailyRetentionDays));
    const cloudArchiveTb = Math.ceil(postDedupeFullTb * (r.monthlyRetentionMonths + (r.yearlyRetentionYears * 12)) * 0.5);

    const recommendedProxyCpuCores = Math.max(Math.ceil(r.protectedVmsCount / 10), 4);
    const recommendedProxyRamGb = recommendedProxyCpuCores * 2;

    return {
      resiliencePlatform: vendor,
      editionTier: tier,
      primaryLicenseSku: primarySku,
      licensedUnitsRequired: licensedUnits,
      licensingMetric: metric,
      localBackupRepositorySizeNeededTb: localRepoTb,
      cloudArchiveSizeNeededTb: cloudArchiveTb,
      recommendedProxyCpuCores,
      recommendedProxyRamGb,
      immutabilityMethod: r.immutabilityTarget
    };
  }
}
