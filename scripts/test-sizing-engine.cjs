
const { SolutionSizingEngine } = require('../dist/engine/calculator.js');

const sampleReq = {
  environmentName: 'Acme Enterprise DC Modernization',
  targetPillars: ['compute', 'storage', 'networking', 'security', 'resilience'],
  compute: {
    totalVms: 120,
    avgVcpuPerVm: 4,
    avgRamGbPerVm: 16,
    vcpuToPcpuRatio: 3.0,
    clusterSurvivabilityMargin: 1,
    targetChassisVendor: 'Dell'
  },
  storage: {
    rawRequiredTb: 100,
    usableWorkloadCapacityTb: 100,
    dailyChangeRatePercent: 5,
    growthRateYearlyPercent: 15,
    workloadType: 'Virtualization_General',
    storageTier: 'Primary_SAN',
    targetVendor: 'Dell'
  },
  networking: {
    spineLeafFabric: true,
    serverOversubscriptionTargetRatio: 3.0,
    dualHomedServers: true,
    targetSwitchVendor: 'Dell'
  },
  security: {
    peakIngressEgressBandwidthGbps: 2.0,
    deepPacketInspectionSsl: true,
    highAvailabilityPair: true,
    targetFirewallVendor: 'Fortinet',
    headroomSafetyMarginPercent: 30
  },
  resilience: {
    protectedVmsCount: 120,
    protectedPhysicalServersCount: 10,
    protectedNasCapacityTb: 20,
    dailyRetentionDays: 30,
    monthlyRetentionMonths: 12,
    yearlyRetentionYears: 3,
    immutabilityTarget: 'Local_Hardened_Linux',
    targetResilienceVendor: 'Veeam'
  }
};

const result = SolutionSizingEngine.calculateSolution(sampleReq);

console.log('=== SIZING ENGINE TEST VERIFICATION ===');
console.log('Environment:', result.environmentName);
console.log('Compute Nodes Recommended:', result.compute?.recommendedNodesCount, 'x', result.compute?.nodeModel);
console.log('Compute Headroom (N+1):', result.compute?.cpuHeadroomPercent + '% CPU /', result.compute?.ramHeadroomPercent + '% RAM');
console.log('Storage Platform:', result.storage?.targetPlatform, '-', result.storage?.recommendedDrivesCount, 'drives (' + result.storage?.driveSizeTb + 'TB)');
console.log('Effective Storage with 4:1 DRR:', result.storage?.effectiveCapacityWithDedupeTb + ' TB');
console.log('Networking Leaf Switches:', result.networking?.leafSwitchesNeeded, 'x', result.networking?.recommendedLeafModel);
console.log('Networking Spine Switches:', result.networking?.spineSwitchesNeeded, 'x', result.networking?.recommendedSpineModel);
console.log('Firewall Sized:', result.security?.firewallModel, '(Throughput Margin:', result.security?.inspectionThroughputMarginPercent + '%)');
console.log('Resilience Licensing:', result.resilience?.licensedUnitsRequired, result.resilience?.licensingMetric);
console.log('Total Bill of Materials Line Items:', result.billOfMaterials.length);

console.log('\n=== BILL OF MATERIALS GENERATED ===');
result.billOfMaterials.forEach((item, idx) => {
  console.log(`[${idx + 1}] ${item.category.toUpperCase()}: ${item.quantity}x ${item.partOrModel} (${item.description})`);
});

if (result.billOfMaterials.length >= 6) {
  console.log('\n[PASS] Sizing Engine and BOM generator verified successfully.');
  process.exit(0);
} else {
  console.error('\n[FAIL] Insufficient BOM items generated.');
  process.exit(1);
}
