
const { SolutionSizingEngine } = require('../dist/engine/calculator.js');
const { SolutionExporter } = require('../dist/export/exporter.js');
const fs = require('fs');

const sampleReq = {
  environmentName: 'Global Cloud Edge Infrastructure Modernization',
  targetPillars: ['compute', 'storage', 'networking', 'security', 'resilience'],
  compute: {
    totalVms: 200,
    avgVcpuPerVm: 4,
    avgRamGbPerVm: 16,
    vcpuToPcpuRatio: 3.0,
    clusterSurvivabilityMargin: 1,
    targetChassisVendor: 'Dell'
  },
  storage: {
    rawRequiredTb: 150,
    usableWorkloadCapacityTb: 150,
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
    peakIngressEgressBandwidthGbps: 2.5,
    deepPacketInspectionSsl: true,
    highAvailabilityPair: true,
    targetFirewallVendor: 'Fortinet',
    headroomSafetyMarginPercent: 30
  },
  resilience: {
    protectedVmsCount: 200,
    protectedPhysicalServersCount: 15,
    protectedNasCapacityTb: 30,
    dailyRetentionDays: 30,
    monthlyRetentionMonths: 12,
    yearlyRetentionYears: 3,
    immutabilityTarget: 'Local_Hardened_Linux',
    targetResilienceVendor: 'Veeam'
  }
};

const solution = SolutionSizingEngine.calculateSolution(sampleReq);

// Test CSV Export
const csvOutput = SolutionExporter.toCsvBom(solution);
console.log('=== CSV EXPORT PREVIEW ===');
console.log(csvOutput.split('\n').slice(0, 5).join('\n'));

// Test Markdown Executive Summary Export
const mdOutput = SolutionExporter.toExecutiveSummary(solution);
console.log('\n=== EXECUTIVE SUMMARY PREVIEW ===');
console.log(mdOutput.split('\n').slice(0, 18).join('\n'));

// Verify outputs
if (csvOutput.includes('Dell PowerEdge R760') && mdOutput.includes('Executive Summary')) {
  console.log('\n[PASS] SolutionExporter verified successfully for CSV and Markdown formats.');
  process.exit(0);
} else {
  console.error('\n[FAIL] Export verification failed.');
  process.exit(1);
}
