import { SizingSolutionOutput } from '../types/sizing';

export class SolutionExporter {
  /**
   * Export BOM items to standard RFC 4180 CSV format
   */
  public static toCsvBom(solution: SizingSolutionOutput): string {
    const headers = ['Category', 'Vendor', 'Part/Model', 'Quantity', 'Unit Type', 'Description'];
    const rows = solution.billOfMaterials.map(item => [
      `"${item.category}"`,
      `"${item.vendor}"`,
      `"${item.partOrModel}"`,
      item.quantity.toString(),
      `"${item.unitType}"`,
      `"${item.description.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  /**
   * Export a formal Customer Executive Summary in Markdown
   */
  public static toExecutiveSummary(solution: SizingSolutionOutput): string {
    const timestamp = new Date(solution.timestamp).toLocaleString();
    let md = `# Enterprise Solution Architecture & Sizing Summary\n\n`;
    md += `**Project Name:** ${solution.environmentName}  \n`;
    md += `**Generated Date:** ${timestamp}  \n`;
    md += `**Engine:** Enterprise Solution Builder v2.0  \n\n`;
    md += `---\n\n`;

    // Executive Overview
    md += `## 1. Executive Overview\n\n`;
    md += `This document outlines the multi-vendor infrastructure Bill of Materials (BOM) and architectural sizing designed for **${solution.environmentName}**. The solution provides high availability, N+1 cluster survivability, data immutability, and wire-speed networking across 5 core pillars.\n\n`;

    // Pillar 1: Compute
    if (solution.compute) {
      const c = solution.compute;
      md += `## 2. Compute & Virtualization Pillar\n\n`;
      md += `- **Hardware Platform:** ${c.recommendedNodesCount}x ${c.nodeModel}\n`;
      md += `- **Total Physical Cores:** ${c.recommendedNodesCount * c.coresPerNode} Cores (${c.coresPerNode} Cores per node)\n`;
      md += `- **Total RAM Capacity:** ${c.recommendedNodesCount * c.ramGbPerNode} GB DDR5 (${c.ramGbPerNode} GB per node)\n`;
      md += `- **Cluster Survivability:** N+1 node failover guaranteed\n`;
      md += `- **Headroom Margins:** ${c.cpuHeadroomPercent}% CPU Headroom / ${c.ramHeadroomPercent}% RAM Headroom under N+1 failure conditions\n\n`;
    }

    // Pillar 2: Storage
    if (solution.storage) {
      const s = solution.storage;
      md += `## 3. Storage & Data Reduction Pillar\n\n`;
      md += `- **Storage Target:** ${s.targetPlatform}\n`;
      md += `- **Usable Workload Capacity:** ${s.usableCapacityRequiredTb} TB\n`;
      md += `- **Data Reduction Ratio (DRR):** ${s.effectiveDataReductionRatio}:1 (Effective capacity: ${s.effectiveCapacityWithDedupeTb} TB)\n`;
      md += `- **Drive Enclosure Configuration:** ${s.recommendedDrivesCount}x ${s.driveSizeTb} TB NVMe SSDs\n`;
      md += `- **Data Protection & Parity:** Dual-parity protection (${Math.round((s.parityOverheadRatio - 1) * 100)}% parity overhead)\n`;
      md += `- **Ransomware Immutability:** ${s.immutabilityCompliant ? 'Verified WORM & S3 Object Lock Compliant' : 'Standard'}\n\n`;
    }

    // Pillar 3: Networking
    if (solution.networking) {
      const n = solution.networking;
      md += `## 4. Data Centre Networking Pillar\n\n`;
      md += `- **ToR Leaf Switch Pair:** ${n.leafSwitchesNeeded}x ${n.recommendedLeafModel} (Active-Active MLAG/VLT)\n`;
      if (n.spineSwitchesNeeded > 0) {
        md += `- **Spine Switches:** ${n.spineSwitchesNeeded}x ${n.recommendedSpineModel} (100GbE Non-Blocking Fabric)\n`;
      }
      md += `- **Downlink Ports (25GbE):** ${n.total25GDownlinkPortsRequired} Dedicated Server/Storage Ports\n`;
      md += `- **Fabric Oversubscription:** ${n.achievedOversubscriptionRatio}:1 Balanced Wire-Speed Fabric\n`;
      md += `- **Cabling Included:** ${n.cablesRequired.dac25gCount}x 25G SFP28 DACs, ${n.cablesRequired.dac100gCount}x 100G QSFP28 DACs\n\n`;
    }

    // Pillar 4: Security
    if (solution.security) {
      const sec = solution.security;
      md += `## 5. Edge & Perimeter Security Pillar\n\n`;
      md += `- **Next-Gen Firewall:** ${sec.applianceCount}x ${sec.firewallModel} (${sec.haArchitecture})\n`;
      md += `- **Threat Prevention Rating:** ${sec.ratedThroughputGbps} Gbps\n`;
      md += `- **Required Bandwidth with Margin:** ${sec.requiredThroughputWithMarginGbps.toFixed(2)} Gbps\n`;
      md += `- **Deep Packet SSL/TLS Inspection Margin:** ${sec.inspectionThroughputMarginPercent}% Headroom\n\n`;
    }

    // Pillar 5: Cyber Resilience
    if (solution.resilience) {
      const r = solution.resilience;
      md += `## 6. Cyber Resilience & Immutable Backup Pillar\n\n`;
      md += `- **Backup Platform:** ${r.resiliencePlatform}\n`;
      md += `- **Licensing Requirement:** ${r.licensedUnitsRequired} ${r.licensingMetric}\n`;
      md += `- **Local Repository Storage Needed:** ${r.localBackupRepositorySizeNeededTb} TB Immutable Repository\n`;
      md += `- **Offsite Cloud Archive Sizing:** ${r.cloudArchiveSizeNeededTb} TB\n`;
      md += `- **Dedicated Backup Proxy Sizing:** ${r.recommendedProxyCpuCores} vCPU Cores, ${r.recommendedProxyRamGb} GB RAM\n`;
      md += `- **Immutability Architecture:** ${r.immutabilityMethod}\n\n`;
    }

    // Bill of Materials Table
    md += `## 7. Bill of Materials (BOM)\n\n`;
    md += `| # | Pillar | Vendor | Model / Part | Qty | Unit | Description |\n`;
    md += `|---|---|---|---|---|---|---|\n`;
    solution.billOfMaterials.forEach((item, idx) => {
      md += `| ${idx + 1} | ${item.category} | ${item.vendor} | ${item.partOrModel} | ${item.quantity} | ${item.unitType} | ${item.description} |\n`;
    });

    md += `\n---\n*Generated automatically by Enterprise Solution Builder v2.0.*\n`;
    return md;
  }
}
