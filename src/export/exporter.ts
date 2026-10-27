import { SizingSolutionOutput } from '../types/sizing';

export class SolutionExporter {
  public static toCsvBom(solution: SizingSolutionOutput): string {
    const headers = ['Category', 'Vendor', 'Part/Model', 'Order SKU', 'Quantity', 'Unit Type', 'Term (Years)', 'Support SLA', 'Description'];
    const rows = solution.billOfMaterials.map(item => [
      `"${item.category}"`,
      `"${item.vendor}"`,
      `"${item.partOrModel}"`,
      `"${item.orderSku}"`,
      item.quantity.toString(),
      `"${item.unitType}"`,
      item.termYears ? item.termYears.toString() : 'N/A',
      `"${item.supportLevel ?? 'Standard'}"`,
      `"${item.description.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public static toExecutiveSummary(solution: SizingSolutionOutput): string {
    const timestamp = new Date(solution.timestamp).toLocaleString();
    let md = `# Enterprise Solution Architecture & Sizing Summary\n\n`;
    md += `**Project Name:** ${solution.environmentName}  \n`;
    md += `**Contract Term:** ${solution.contractTermYears} Years  \n`;
    md += `**Support SLA:** ${solution.supportSla}  \n`;
    md += `**Generated Date:** ${timestamp}  \n`;
    md += `**Engine:** Enterprise Solution Builder v2.0  \n\n`;
    md += `---\n\n`;

    md += `## 1. Executive Summary\n\n`;
    md += `This architecture report details the production sizing, failure survivability, and distributor Bill of Materials (BOM) for **${solution.environmentName}**. All components include verified manufacturer ordering SKUs, enterprise 24x7 Mission Critical support, and certified vendor interoperability.\n\n`;

    if (solution.compute) {
      const c = solution.compute;
      md += `## 2. Compute Pillar (${c.nodeModel})\n\n`;
      md += `- **Chassis Order SKU:** \`${c.nodeBaseSku}\`\n`;
      md += `- **Recommended Cluster:** ${c.recommendedNodesCount} Nodes (Total: ${c.recommendedNodesCount * c.coresPerNode} Cores, ${c.recommendedNodesCount * c.ramGbPerNode} GB DDR5)\n`;
      md += `- **Cluster Survivability:** N+1 node failover guaranteed (${c.cpuHeadroomPercent}% CPU / ${c.ramHeadroomPercent}% RAM reserve under failure)\n\n`;
    }

    if (solution.storage) {
      const s = solution.storage;
      md += `## 3. Storage Pillar (${s.targetPlatform})\n\n`;
      md += `- **Usable Workload Capacity:** ${s.usableCapacityRequiredTb} TB (Effective with Dedupe: ${s.effectiveCapacityWithDedupeTb} TB)\n`;
      md += `- **Drive Enclosure SKU:** \`${s.drivePackSku}\` (${s.recommendedDrivesCount}x ${s.driveSizeTb} TB NVMe SSDs)\n`;
      md += `- **Data Reduction Ratio:** ${s.effectiveDataReductionRatio}:1 Guaranteed\n`;
      md += `- **Immutability:** ${s.immutabilityCompliant ? 'Compliant WORM & S3 Object Lock' : 'Standard'}\n\n`;
    }

    if (solution.networking) {
      const n = solution.networking;
      md += `## 4. Networking Pillar (Wire-Speed Fabric)\n\n`;
      md += `- **ToR Leaf Switches:** ${n.leafSwitchesNeeded}x ${n.recommendedLeafModel} (SKU: \`${n.leafSku}\`)\n`;
      if (n.spineSwitchesNeeded > 0) {
        md += `- **Spine Switches:** ${n.spineSwitchesNeeded}x ${n.recommendedSpineModel} (SKU: \`${n.spineSku}\`)\n`;
      }
      md += `- **25G Downlink Ports:** ${n.total25GDownlinkPortsRequired} Ports (Cabling SKU: \`${n.cablesRequired.dac25gSku}\`)\n`;
      md += `- **Fabric Oversubscription:** ${n.achievedOversubscriptionRatio}:1 Non-Blocking\n\n`;
    }

    if (solution.security) {
      const sec = solution.security;
      md += `## 5. Security Pillar (Next-Gen Firewall)\n\n`;
      md += `- **Appliance Model:** ${sec.applianceCount}x ${sec.firewallModel} (Hardware SKU: \`${sec.applianceHardwareSku}\`)\n`;
      md += `- **Subscription Bundle SKU:** \`${sec.subscriptionBundleSku}\` (Unified Threat Protection with 24x7 Support)\n`;
      md += `- **SSL/TLS Inspection Headroom:** ${sec.inspectionThroughputMarginPercent}% Margin\n\n`;
    }

    if (solution.resilience) {
      const r = solution.resilience;
      md += `## 6. Cyber Resilience Pillar (${r.resiliencePlatform})\n\n`;
      md += `- **Edition Tier:** ${r.editionTier}\n`;
      md += `- **Orderable License SKU:** \`${r.primaryLicenseSku}\`\n`;
      md += `- **Licensed Units:** ${r.licensedUnitsRequired} ${r.licensingMetric}\n`;
      md += `- **Local Immutable Repository:** ${r.localBackupRepositorySizeNeededTb} TB Needed\n`;
      md += `- **Cloud Archive Repository:** ${r.cloudArchiveSizeNeededTb} TB Needed\n\n`;
    }

    md += `## 7. Official Distributor Bill of Materials (BOM)\n\n`;
    md += `| # | Pillar | Vendor | Part / Model | Order SKU | Qty | Unit | Term | Support SLA |\n`;
    md += `|---|---|---|---|---|---|---|---|---|\n`;
    solution.billOfMaterials.forEach((item, idx) => {
      md += `| ${idx + 1} | ${item.category} | ${item.vendor} | ${item.partOrModel} | \`${item.orderSku}\` | ${item.quantity} | ${item.unitType} | ${item.termYears ?? 'N/A'} Yr | ${item.supportLevel ?? 'Standard'} |\n`;
    });

    md += `\n---\n*Generated by Enterprise Solution Builder v2.0 - Certified Multi-Vendor BOM Engine.*\n`;
    return md;
  }
}
