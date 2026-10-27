/**
 * Sizing Engine Core Types & Models - Enterprise Solution Builder v2.0
 */

export interface WorkloadRequirements {
  environmentName: string;
  contractTermYears: 1 | 3 | 5;
  supportSla: 'Next_Business_Day' | 'Mission_Critical_4Hr_24x7';
  targetPillars: ('compute' | 'storage' | 'networking' | 'security' | 'resilience')[];

  compute?: {
    totalVms: number;
    avgVcpuPerVm: number;
    avgRamGbPerVm: number;
    vcpuToPcpuRatio: number;
    clusterSurvivabilityMargin: number;
    targetChassisVendor?: 'Dell' | 'Supermicro';
  };

  storage?: {
    usableWorkloadCapacityTb: number;
    dailyChangeRatePercent: number;
    growthRateYearlyPercent: number;
    workloadType: 'Virtualization_General' | 'Database_HighIOPS' | 'Object_Backup';
    targetVendor?: 'Dell' | 'Scality' | 'Wasabi' | 'PeaSoup';
    expectedDedupeRatio?: number;
  };

  networking?: {
    spineLeafFabric: boolean;
    serverOversubscriptionTargetRatio: number;
    dualHomedServers: boolean;
    targetSwitchVendor?: 'Dell' | 'Arista';
  };

  security?: {
    peakIngressEgressBandwidthGbps: number;
    deepPacketInspectionSsl: boolean;
    highAvailabilityPair: boolean;
    targetFirewallVendor?: 'Fortinet' | 'Check Point' | 'Sophos';
    headroomSafetyMarginPercent: number;
  };

  resilience?: {
    protectedVmsCount: number;
    protectedPhysicalServersCount: number;
    protectedNasCapacityTb: number;
    protectedM365UsersCount?: number;
    dailyRetentionDays: number;
    monthlyRetentionMonths: number;
    yearlyRetentionYears: number;
    immutabilityTarget: 'Local_Hardened_Linux' | 'OnPrem_S3_ObjectLock' | 'Cloud_S3_ObjectLock';
    targetResilienceVendor?: 'Veeam' | 'Commvault' | 'Cohesity';
    tierLevel?: 'Foundation' | 'Advanced' | 'Premium';
  };
}

export interface SolutionBOMItem {
  category: 'Compute' | 'Storage' | 'Networking' | 'Security' | 'Resilience';
  partOrModel: string;
  vendor: string;
  orderSku: string;
  quantity: number;
  description: string;
  unitType: 'Node' | 'Appliance' | 'Switch' | 'Cable' | 'License' | 'TB_Subscription' | 'Service_Pack';
  termYears?: number;
  supportLevel?: string;
}

export interface ComputeSizingResult {
  requiredPhysicalCores: number;
  requiredTotalRamGb: number;
  recommendedNodesCount: number;
  nodeModel: string;
  nodeBaseSku: string;
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
  drivePackSku: string;
  parityOverheadRatio: number;
  effectiveDataReductionRatio: number;
  immutabilityCompliant: boolean;
}

export interface NetworkSizingResult {
  leafSwitchesNeeded: number;
  spineSwitchesNeeded: number;
  leafSku: string;
  spineSku: string;
  total25GDownlinkPortsRequired: number;
  total100GUplinkPortsRequired: number;
  achievedOversubscriptionRatio: number;
  cablesRequired: {
    dac25gCount: number;
    dac100gCount: number;
    dac25gSku: string;
    dac100gSku: string;
  };
  recommendedLeafModel: string;
  recommendedSpineModel: string;
}

export interface SecuritySizingResult {
  firewallModel: string;
  applianceHardwareSku: string;
  subscriptionBundleSku: string;
  ratedThroughputGbps: number;
  requiredThroughputWithMarginGbps: number;
  inspectionThroughputMarginPercent: number;
  applianceCount: number;
  haArchitecture: string;
}

export interface ResilienceSizingResult {
  resiliencePlatform: string;
  editionTier: string;
  primaryLicenseSku: string;
  licensedUnitsRequired: number;
  licensingMetric: string;
  localBackupRepositorySizeNeededTb: number;
  cloudArchiveSizeNeededTb: number;
  recommendedProxyCpuCores: number;
  recommendedProxyRamGb: number;
  immutabilityMethod: string;
}

export interface SizingSolutionOutput {
  environmentName: string;
  timestamp: string;
  contractTermYears: 1 | 3 | 5;
  supportSla: string;
  compute?: ComputeSizingResult;
  storage?: StorageSizingResult;
  networking?: NetworkSizingResult;
  security?: SecuritySizingResult;
  resilience?: ResilienceSizingResult;
  billOfMaterials: SolutionBOMItem[];
}
