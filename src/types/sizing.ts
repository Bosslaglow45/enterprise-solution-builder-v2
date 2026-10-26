/**
 * Sizing Engine Core Types & Models
 * Enterprise Solution Builder v2.0
 */

export interface WorkloadRequirements {
  // General
  environmentName: string;
  targetPillars: ('compute' | 'storage' | 'networking' | 'security' | 'resilience')[];

  // 1. Compute & Virtualization
  compute?: {
    totalVms: number;
    avgVcpuPerVm: number;
    avgRamGbPerVm: number;
    vcpuToPcpuRatio: number; // e.g. 3.0 for 3:1 vCPU:pCPU
    clusterSurvivabilityMargin: number; // e.g. 1 for N+1, 2 for N+2
    targetCpuFamily?: 'Intel' | 'AMD';
    targetChassisVendor?: 'Dell' | 'Supermicro';
    preferredFormFactor?: '1U' | '2U';
  };

  // 2. Storage
  storage?: {
    rawRequiredTb: number;
    usableWorkloadCapacityTb: number;
    dailyChangeRatePercent: number; // e.g. 5%
    growthRateYearlyPercent: number; // e.g. 15%
    workloadType: 'Virtualization_General' | 'Database_HighIOPS' | 'Object_Backup' | 'Unstructured_File';
    storageTier: 'Primary_SAN' | 'OnPrem_Object' | 'Cloud_Offsite';
    targetVendor?: 'Dell' | 'Scality' | 'Wasabi' | 'PeaSoup';
    expectedDedupeRatio?: number; // e.g. 4.0 for 4:1
  };

  // 3. Networking
  networking?: {
    spineLeafFabric: boolean;
    serverOversubscriptionTargetRatio: number; // e.g. 3.0 for 3:1
    dualHomedServers: boolean; // MLAG / LACP bonded 25G uplinks
    targetSwitchVendor?: 'Dell' | 'Arista';
  };

  // 4. Security
  security?: {
    peakIngressEgressBandwidthGbps: number;
    deepPacketInspectionSsl: boolean;
    highAvailabilityPair: boolean;
    targetFirewallVendor?: 'Fortinet' | 'Check Point' | 'Sophos';
    headroomSafetyMarginPercent: number; // e.g. 30% overhead
  };

  // 5. Cyber Resilience & Backup
  resilience?: {
    protectedVmsCount: number;
    protectedPhysicalServersCount: number;
    protectedNasCapacityTb: number;
    dailyRetentionDays: number; // e.g. 30 days
    monthlyRetentionMonths: number; // e.g. 12 months
    yearlyRetentionYears: number; // e.g. 3 years
    immutabilityTarget: 'Local_Hardened_Linux' | 'OnPrem_S3_ObjectLock' | 'Cloud_S3_ObjectLock';
    targetResilienceVendor?: 'Veeam' | 'Commvault' | 'Cohesity';
    expectedBackupDedupeRatio?: number; // e.g. 2.8:1
  };
}

export interface ComputeSizingResult {
  requiredPhysicalCores: number;
  requiredTotalRamGb: number;
  recommendedNodesCount: number;
  nodeModel: string;
  coresPerNode: number;
  ramGbPerNode: number;
  usableClusterCoresWithNPlusOne: number;
  usableClusterRamWithNPlusOne: number;
  cpuHeadroomPercent: number;
  ramHeadroomPercent: number;
}

export interface StorageSizingResult {
  targetPlatform: string;
  usableCapacityRequiredTb: number;
  effectiveCapacityWithDedupeTb: number;
  rawCapacityNeededWithParityTb: number;
  recommendedDrivesCount: number;
  driveSizeTb: number;
  parityOverheadRatio: number;
  effectiveDataReductionRatio: number;
  immutabilityCompliant: boolean;
}

export interface NetworkSizingResult {
  leafSwitchesNeeded: number;
  spineSwitchesNeeded: number;
  total25GDownlinkPortsRequired: number;
  total100GUplinkPortsRequired: number;
  achievedOversubscriptionRatio: number;
  cablesRequired: {
    dac25gCount: number;
    dac100gCount: number;
  };
  recommendedLeafModel: string;
  recommendedSpineModel: string;
}

export interface SecuritySizingResult {
  firewallModel: string;
  ratedThroughputGbps: number;
  requiredThroughputWithMarginGbps: number;
  inspectionThroughputMarginPercent: number;
  applianceCount: number;
  haArchitecture: string;
}

export interface ResilienceSizingResult {
  resiliencePlatform: string;
  licensingMetric: string;
  licensedUnitsRequired: number; // e.g. VUL instances or FrontEnd TB
  localBackupRepositorySizeNeededTb: number;
  cloudArchiveSizeNeededTb: number;
  recommendedProxyCpuCores: number;
  recommendedProxyRamGb: number;
  immutabilityMethod: string;
}

export interface SolutionBOMItem {
  category: 'Compute' | 'Storage' | 'Networking' | 'Security' | 'Resilience';
  partOrModel: string;
  vendor: string;
  quantity: number;
  description: string;
  unitType: 'Node' | 'Appliance' | 'Switch' | 'Cable' | 'License' | 'TB_Subscription';
}

export interface SizingSolutionOutput {
  environmentName: string;
  timestamp: string;
  compute?: ComputeSizingResult;
  storage?: StorageSizingResult;
  networking?: NetworkSizingResult;
  security?: SecuritySizingResult;
  resilience?: ResilienceSizingResult;
  billOfMaterials: SolutionBOMItem[];
}
