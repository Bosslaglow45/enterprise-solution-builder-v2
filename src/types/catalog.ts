/**
 * Canonical TypeScript interfaces for the catalog JSON schemas in /catalog.
 *
 * Source of truth: catalog/*.schema.json. Keep this file in sync with them.
 * Optionality mirrors each schema's "required" arrays; string unions mirror
 * the schemas' "enum" values exactly.
 */

// ---------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------

export type Pillar = 'compute' | 'storage' | 'networking' | 'security' | 'resilience';

/** base-driver.schema.json (BaseDriverDefinition). */
export interface BaseDriverDefinition {
  /** Unique driver identifier, e.g. 'dell-poweredge'. */
  id: string;
  pillar: Pillar;
  vendor: string;
  driverVersion: string;
  description?: string;
  /** Required unless `editions` is present (schema anyOf). */
  models?: Record<string, unknown>[];
  /** Used by the resilience pillar instead of `models`. */
  editions?: Record<string, unknown>[];
}

/** Fields shared by every pillar catalog document. */
export interface CatalogDocumentBase<P extends Pillar, V extends string> {
  id: string;
  pillar: P;
  vendor: V;
  driverVersion?: string;
}

// ---------------------------------------------------------------------------
// Compute (compute.schema.json)
// ---------------------------------------------------------------------------

export type ComputeVendor = 'Dell' | 'Supermicro' | 'Generic';
export type ComputeFormFactor = '1U' | '2U' | '4U' | 'Chassis-Blade';
export type DriveBayFormFactor = '2.5_SFF' | '3.5_LFF' | 'E3.S' | 'NVMe_Direct';
export type DriveInterface = 'SAS' | 'SATA' | 'NVMe' | 'PCIe5';
export type MemoryType = 'DDR4' | 'DDR5';
export type PsuRedundancy = '1+0' | '1+1' | '2+2';
export type PsuEfficiencyRating = 'Gold' | 'Platinum' | 'Titanium';
export type PsuInputVoltage = 'AC' | 'DC' | 'HVDC';
export type PcieGeneration = 3 | 4 | 5 | 6;
export type PcieLaneWidth = 1 | 4 | 8 | 16;
export type PcieSlotFormFactor = 'FHFL' | 'FHHL' | 'LP' | 'OCP3' | 'Riser';

export interface ComputeDriveBays {
  formFactor: DriveBayFormFactor;
  maxSlots: number;
  supportedInterfaces?: DriveInterface[];
}

export interface ComputeNetworkOption {
  adapterType?: string;
  ports?: number;
  speedGbps?: number;
}

export interface ComputePowerSupplies {
  redundancy?: PsuRedundancy;
  /** Selectable PSU wattages (W). */
  supportedWattages?: number[];
  maxPsuCount?: number;
  efficiencyRating?: PsuEfficiencyRating;
  inputVoltage?: PsuInputVoltage;
}

export interface ComputeCpuOption {
  /** e.g. 'Xeon Gold 6444Y'. */
  sku: string;
  /** e.g. 'Sapphire Rapids', 'Genoa'. */
  architecture?: string;
  /** Physical cores per socket (>= 1). */
  coresPerSocket: number;
  threadsPerSocket?: number;
  /** Base clock (GHz, > 0). */
  baseClockGhz: number;
  /** Max boost clock (GHz, > 0). */
  maxBoostClockGhz?: number;
  /** TDP per socket (W, >= 1). */
  tdpWatts: number;
  pcieLanesPerSocket?: number;
  memoryChannelsPerSocket?: number;
}

export interface ComputePcieSlotGroup {
  count: number;
  generation: PcieGeneration;
  lanes: PcieLaneWidth;
  slotFormFactor?: PcieSlotFormFactor;
}

export interface ComputeModel {
  /** e.g. 'PowerEdge R760'. */
  modelName: string;
  formFactor: ComputeFormFactor;
  /** Socket count (1-8). */
  cpuSockets: number;
  supportedCpuArchitectures?: string[];
  /** Maximum RAM capacity (GB). */
  maxMemoryGb: number;
  memorySlots?: number;
  memoryType?: MemoryType;
  /** Supported RAM speeds (MT/s). */
  memorySpeedsMtps?: number[];
  maxDimmSizeGb?: number;
  driveBays: ComputeDriveBays;
  /** Total PCIe slot count. */
  pcieSlots?: number;
  pcieLanesTotal?: number;
  pcieSlotDetails?: ComputePcieSlotGroup[];
  networkOptions?: ComputeNetworkOption[];
  powerSupplies?: ComputePowerSupplies;
  cpuOptions?: ComputeCpuOption[];
  /** Max configured chassis draw (W) for PDU/circuit checks. */
  maxPowerDrawWatts?: number;
}

export interface ComputeCatalog extends CatalogDocumentBase<'compute', ComputeVendor> {
  models: ComputeModel[];
}

// ---------------------------------------------------------------------------
// Storage (storage.schema.json)
// ---------------------------------------------------------------------------

export type StorageVendor = 'Scality' | 'PeaSoup' | 'Wasabi' | 'Dell' | 'Generic';
export type StorageType = 'SAN_Block' | 'NAS_File' | 'Unified' | 'Object_S3' | 'Cloud_Offsite';
export type StorageArchitecture = 'Scale-Up' | 'Scale-Out' | 'Cloud_Managed';
export type StorageProtocol = 'iSCSI' | 'FC' | 'NVMe-oF' | 'NFS' | 'SMB' | 'S3' | 'S3_Object_Lock';
export type StorageAccessMode = 'Block' | 'File' | 'Object';
export type StoragePricingModel = 'CapEx_Hardware' | 'OpEx_PerTbMonth' | 'Tiered_Subscription';
export type ProtectionSchemeType =
  | 'RAID1'
  | 'RAID5'
  | 'RAID6'
  | 'RAID10'
  | 'Erasure_Coding'
  | 'Replication'
  | 'Vendor_Proprietary'
  | 'None';
export type PerformanceScalingUnit = 'System' | 'Node' | 'Drive' | 'Shelf';

export interface CapacityRangeTb {
  min: number;
  max: number;
}

export interface StoragePricingMetrics {
  model?: StoragePricingModel;
  unitCostCurrency?: string;
  egressFeePerGb?: number;
  apiCallFeeIncluded?: boolean;
}

/** Parity/protection overhead definition used to derive usable from raw capacity. */
export interface StorageProtectionScheme {
  /** e.g. 'RAID6 8+2', 'EC 7+3'. */
  name: string;
  type: ProtectionSchemeType;
  /** Data fragments/drives (k). */
  dataUnits?: number;
  /** Parity fragments/drives (m). */
  parityUnits?: number;
  /** Copies, for Replication. */
  replicaCount?: number;
  minFailureDomains?: number;
  /** Precomputed data fraction (0-1), e.g. k/(k+m); overrides k/m when set. */
  usableFraction?: number;
  /** Human-readable formula, e.g. 'usable = raw * k/(k+m)'. */
  formula?: string;
}

/**
 * usable = raw * dataFraction * (1 - spareFraction) * (1 - systemOverheadFraction)
 * (before data reduction).
 */
export interface StorageUsableCapacity {
  spareFraction?: number;
  systemOverheadFraction?: number;
  protectionSchemes?: StorageProtectionScheme[];
}

export interface StorageIopsProfile {
  /** e.g. '4K_Random_Read', '8K_70R30W_Mixed'. */
  profile: string;
  ioSizeKb?: number;
  /** Read share, 0-100. */
  readPercent?: number;
  iops: number;
  latencyMs?: number;
}

export interface StorageThroughput {
  sequentialReadMBps?: number;
  sequentialWriteMBps?: number;
}

export interface StoragePerformance {
  iopsProfiles?: StorageIopsProfile[];
  throughput?: StorageThroughput;
  /** What the performance figures apply to. */
  scalingUnit?: PerformanceScalingUnit;
}

export interface StorageModel {
  modelName: string;
  storageType: StorageType;
  architecture?: StorageArchitecture;
  protocolSupport: StorageProtocol[];
  accessModes?: StorageAccessMode[];
  rawCapacityRangeTb?: CapacityRangeTb;
  /** Expected data reduction ratio, e.g. 3.5 for 3.5:1. */
  dedupeCompressionRatio?: number;
  immutabilitySupport?: boolean;
  pricingMetrics?: StoragePricingMetrics;
  usableCapacity?: StorageUsableCapacity;
  performance?: StoragePerformance;
}

export interface StorageCatalog extends CatalogDocumentBase<'storage', StorageVendor> {
  models: StorageModel[];
}

// ---------------------------------------------------------------------------
// Networking (networking.schema.json)
// ---------------------------------------------------------------------------

export type NetworkingVendor = 'Dell' | 'Arista' | 'Generic';
export type SwitchRole = 'ToR_Leaf' | 'Spine' | 'Management' | 'Edge_Interconnect';
export type SwitchFormFactor = '1U' | '2U';
export type PortConnectorType = 'SFP+' | 'SFP28' | 'QSFP+' | 'QSFP28' | 'QSFP-DD' | 'OSFP' | 'RJ45';
export type TransceiverFormFactor = 'SFP+' | 'SFP28' | 'QSFP+' | 'QSFP28' | 'QSFP-DD' | 'OSFP';
export type PortSpeedGbps = 1 | 10 | 25 | 40 | 50 | 100 | 200 | 400;
export type PortRole = 'Downlink' | 'Uplink' | 'Management' | 'Stacking';
export type CableSupport = 'Passive_DAC' | 'Active_AOC' | 'Optical_Transceiver';
export type TransceiverMedia = 'Passive_DAC' | 'Active_DAC' | 'AOC' | 'SR' | 'LR' | 'ER' | 'BASE-T';
export type NetworkFeature = 'MLAG' | 'EVPN-VXLAN' | 'BGP' | 'RoCEv2' | 'PTP';

export interface SwitchPortGroup {
  /** Port density for this group. */
  count: number;
  connectorType: PortConnectorType;
  speedGbps: PortSpeedGbps;
  breakoutCapable?: boolean;
  /** Used to derive oversubscription. */
  portRole?: PortRole;
  /** e.g. '4x25G', '4x10G', '2x50G'. */
  breakoutModes?: string[];
}

export interface TransceiverSupport {
  formFactor: TransceiverFormFactor;
  speedGbps: PortSpeedGbps;
  media: TransceiverMedia;
  maxReachMeters?: number;
  /** Far-end layout for breakout cables, e.g. '4xSFP28'. */
  breakoutTo?: string;
}

export interface NetworkingModel {
  modelName: string;
  role: SwitchRole;
  formFactor?: SwitchFormFactor;
  /** Fabric switching capacity (Tbps). */
  switchingCapacityTbps: number;
  ports: SwitchPortGroup[];
  cableSupport?: CableSupport[];
  supportedFeatures?: NetworkFeature[];
  /** Declared downlink:uplink ratio as N (N:1); 1 = non-blocking. */
  oversubscriptionRatio?: number;
  nonBlocking?: boolean;
  forwardingRateMpps?: number;
  transceiverSupport?: TransceiverSupport[];
}

export interface NetworkingCatalog extends CatalogDocumentBase<'networking', NetworkingVendor> {
  models: NetworkingModel[];
}

// ---------------------------------------------------------------------------
// Security (security.schema.json)
// ---------------------------------------------------------------------------

export type SecurityVendor = 'Check Point' | 'Fortinet' | 'Sophos' | 'Generic';
export type HaMode = 'Active-Passive' | 'Active-Active' | 'ClusterXL' | 'FGCP' | 'FGSP' | 'Standalone_Only';

export interface SecurityNetworkInterface {
  count?: number;
  type?: string;
  speedGbps?: number;
}

export interface HaPairConfig {
  /** 2 for a classic pair (min 2). */
  maxClusterMembers?: number;
  requiresIdenticalHardware?: boolean;
  syncPortType?: string;
  syncPortSpeedGbps?: number;
  /** Pair throughput multiplier vs a single unit in Active-Active (1.0 = no gain). */
  activeActiveThroughputFactor?: number;
  /** True if each pair member needs its own subscription. */
  licensePerNode?: boolean;
}

export interface SecurityHaSupport {
  modes?: HaMode[];
  dedicatedSyncPorts?: number;
  pairConfig?: HaPairConfig;
}

export interface SecurityLicensingTier {
  name?: string;
  includedServices?: string[];
}

export interface SecurityModel {
  modelName: string;
  series?: string;
  /** Raw firewall throughput (Gbps). */
  firewallThroughputGbps: number;
  /** NGFW throughput (Gbps). */
  ngfwThroughputGbps?: number;
  /** Threat Prevention throughput (Gbps). */
  threatPreventionThroughputGbps: number;
  /** SSL/TLS inspection throughput (Gbps). */
  sslInspectionThroughputGbps?: number;
  maxConcurrentSessions?: number;
  newSessionsPerSecond?: number;
  networkInterfaces?: SecurityNetworkInterface[];
  haSupport: SecurityHaSupport;
  licensingTiers?: SecurityLicensingTier[];
  /** Test basis for datasheet figures, e.g. 'Enterprise testing conditions, 1518B UDP'. */
  throughputBasis?: string;
}

export interface SecurityCatalog extends CatalogDocumentBase<'security', SecurityVendor> {
  models: SecurityModel[];
}

// ---------------------------------------------------------------------------
// Cyber Resilience (resilience.schema.json)
// ---------------------------------------------------------------------------

export type ResilienceVendor = 'Veeam' | 'Commvault' | 'Cohesity' | 'Generic';
export type LicensingModel =
  | 'VUL_Per_Instance'
  | 'Per_Socket'
  | 'Capacity_FrontEnd_TB'
  | 'Per_User_M365'
  | 'Consumption'
  | 'Per_Workload_Unit';
export type ProtectedWorkload =
  | 'VMware'
  | 'Hyper-V'
  | 'AHV'
  | 'Physical_Server'
  | 'NAS_File'
  | 'M365'
  | 'Kubernetes'
  | 'Cloud_Native';
export type LicenseUnitBasis = 'Instance' | 'Socket' | 'User' | 'TB';
export type AirGapTier = 'Logical_Air_Gap' | 'Offline_Tape' | 'Isolated_Recovery_Vault' | 'Cloud_Vault';
export type RepositoryType =
  | 'Hardened_Linux_Repo'
  | 'S3_Object_Lock'
  | 'S3_Compatible'
  | 'Dedupe_Appliance'
  | 'NAS_SMB_NFS'
  | 'Tape'
  | 'Cloud_Object';

export interface ResilienceImmutabilitySupport {
  hardenedRepositoryLinux?: boolean;
  s3ObjectLock?: boolean;
  retentionLock?: boolean;
  airGapTiers?: AirGapTier[];
}

export interface ResilienceSizingFormulas {
  recommendedProxyCpuPerConcurrentTask?: number;
  recommendedProxyRamGbPerConcurrentTask?: number;
  dedupeCompressionEstimateRatio?: number;
}

export interface WorkloadUnitConversion {
  workload: ProtectedWorkload;
  /** Licence units consumed per workload (e.g. 1 VUL per VM). */
  units: number;
  perUnitOf?: LicenseUnitBasis;
}

export interface ResilienceLicensingDetails {
  /** e.g. 'VUL', 'workload', 'front-end TB'. */
  unitName?: string;
  unitsPerWorkload?: WorkloadUnitConversion[];
  /** How front-end TB is measured, e.g. 'largest full backup'. */
  frontEndTbBasis?: string;
  minimumUnits?: number;
  termYears?: number[];
}

export interface CompatibleRepository {
  type: RepositoryType;
  immutable?: boolean;
  airGapTier?: AirGapTier | 'None';
  notes?: string;
}

export interface ResilienceEdition {
  editionName: string;
  licensingModel: LicensingModel;
  supportedWorkloads: ProtectedWorkload[];
  immutabilitySupport?: ResilienceImmutabilitySupport;
  sizingFormulas?: ResilienceSizingFormulas;
  licensingDetails?: ResilienceLicensingDetails;
  compatibleRepositories?: CompatibleRepository[];
}

export interface ResilienceCatalog extends CatalogDocumentBase<'resilience', ResilienceVendor> {
  editions: ResilienceEdition[];
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export type CatalogDocument =
  | ComputeCatalog
  | StorageCatalog
  | NetworkingCatalog
  | SecurityCatalog
  | ResilienceCatalog;

/** Maps each pillar to its catalog document type. */
export interface CatalogByPillar {
  compute: ComputeCatalog;
  storage: StorageCatalog;
  networking: NetworkingCatalog;
  security: SecurityCatalog;
  resilience: ResilienceCatalog;
}
