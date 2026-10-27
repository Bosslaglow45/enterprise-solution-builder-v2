import { DealContext, CompetitiveBattlecard, ProposalPitchPack } from '../types/commercial';
import { SizingSolutionOutput } from '../types/sizing';

export class CompetitiveIntelligenceEngine {
  private static BATTLECARDS: Record<string, CompetitiveBattlecard> = {
    'Rubrik': {
      competitor: 'Rubrik',
      competitorWeaknesses: [
        'Proprietary hardware lock-in requiring expensive proprietary Brik refreshes.',
        'Extremely high OpEx subscription costs that escalate heavily at year 3 and 5 renewal.',
        'Data gravity lock-in: exorbitant egress costs when attempting to pull archives or secondary copies out.'
      ],
      displacementHooks: [
        'Hardware Freedom: Deploy on standard enterprise Dell PowerEdge or Supermicro servers with standard Linux Hardened Repositories.',
        'Transparent Economics: Pair Veeam with Wasabi or PeaSoup for true $0 egress fees and predictable flat per-TB pricing.',
        'Unified 5-Pillar Synergy: Deliver compute, primary SAN, wire-speed networking, and firewall under a single validated architecture.'
      ],
      landminesToDrop: [
        'Ask the customer: "What is your contractual exit cost or data egress fee if you ever choose to leave your backup cloud vault?"',
        'Ask the customer: "When a hardware node fails out of warranty, are you required to buy full proprietary nodes or can you service commodity disks?"'
      ],
      recommendedPitchAngle: 'Liberate the customer from closed proprietary backup appliances with an open, zero-egress, enterprise-grade architecture that delivers 40%+ TCO savings.'
    },
    'Cohesity': {
      competitor: 'Cohesity',
      competitorWeaknesses: [
        'Complex 3-node minimum clustering footprint makes branch, edge, or mid-market entry cost-prohibitive.',
        'Heavy metadata overhead eating into usable capacity for small-to-mid enterprise datasets.',
        'Multi-workload indexing contention during heavy simultaneous backup windows.'
      ],
      displacementHooks: [
        'Right-Sized Deployment: Scality ARTESCA starts from a single 1U/2U server up to PB scale without cluster node tax.',
        'Dedicated Purpose-Built Performance: Separation of primary high-IOPS NVMe flash (PowerStore) from immutable backup tiering.',
        'Simpler Licensing: Flat instance-based VUL licensing without opaque cluster capacity consumption penalties.'
      ],
      landminesToDrop: [
        'Ask: "What is the minimum physical node expansion requirement when you only need to add 20TB of extra capacity?"',
        'Ask: "How many usable gigabytes of RAM and compute are consumed purely running the cluster\'s SpanFS management overhead?"'
      ],
      recommendedPitchAngle: 'Deliver dedicated sub-millisecond primary storage performance alongside decoupled, scalable S3 immutable backup rather than a compromised secondary hybrid.'
    },
    'Dell_PowerProtect': {
      competitor: 'Dell PowerProtect (Data Domain)',
      competitorWeaknesses: [
        'Legacy architecture designed for tape-replacement streaming rather than instant VM boot and rapid ransomware recovery.',
        'Very slow instant recovery performance due to deep deduplication reconstruction latency.',
        'Complex dual-interface management split between appliance DD OS and separate backup software.'
      ],
      displacementHooks: [
        'Instant Multi-VM Boot: Direct-to-NVMe flash restore with Dell PowerStore and Veeam Instant VM Recovery.',
        'Modern Object-First Security: Native S3 Object Lock compliance rather than proprietary DD Retention Lock.',
        'Unified Multi-Vendor Flexibility: Combine Dell compute and networking with best-of-breed security and cyber resilience.'
      ],
      landminesToDrop: [
        'Ask: "In a total ransomware wipeout, how many hours will it take to rehydrate 50TB of data off Data Domain for parallel VM boots?"',
        'Ask: "Does your retention lock prevent root admin deletion, or does it require manual serial console intervention?"'
      ],
      recommendedPitchAngle: 'Move from legacy archival dedupe boxes to an active cyber-resilience architecture that guarantees RTO in minutes, not days.'
    },
    'VMware_Broadcom': {
      competitor: 'VMware by Broadcom (VCF / VVF)',
      competitorWeaknesses: [
        'Massive subscription price hikes (up to 300-500% increases on core socket licensing).',
        'Forced bundling of unnecessary products (VCF tax) for customers who only need core hypervisor resilience.',
        'Shrinking ecosystem support and partner channel margin cuts.'
      ],
      displacementHooks: [
        'Alternative Hypervisor Freedom: Nutanix AHV or Proxmox/KVM supported seamlessly by our Compute and Cyber Resilience engine.',
        'Hardware Optimization: High-density Dell PowerEdge R760 with 64-core Xeon Gold minimizing per-core software licensing footprints.',
        'Decoupled SAN/NAS: Dell PowerStore independent scaling avoiding forced vSAN capacity licensing traps.'
      ],
      landminesToDrop: [
        'Ask: "What is your projected VMware renewal budget over the next 3 years under the mandatory per-core VCF packaging?"',
        'Ask: "Are you paying for vSAN capacity licenses on storage that you don\'t even run on vSAN?"'
      ],
      recommendedPitchAngle: 'Protect your enterprise from hypervisor licensing volatility with a hardware and storage foundation designed for hypervisor portability.'
    },
    'Palo_Alto': {
      competitor: 'Palo Alto Networks',
      competitorWeaknesses: [
        'High hardware appliance pricing and expensive recurring subscription subscriptions.',
        'Significant performance degradation when full SSL decryption and Cloud Inline Sandboxing are enabled simultaneously.',
        'Complex multi-tier management requiring dedicated Panorama appliances and separate licensing.'
      ],
      displacementHooks: [
        'Dedicated Hardware ASICs: Fortinet SOC4/CP9 fast-path processing delivering 3x higher Threat Prevention throughput per dollar.',
        'Integrated HA at Zero Extra Tax: Active-Passive clustering included natively with simplified state synchronization.',
        'Complete Fabric Integration: Automated quarantine and threat response linked directly with data centre switches.'
      ],
      landminesToDrop: [
        'Ask: "What is the measured real-world throughput of your PA firewall once SSL/TLS decryption is turned on for 100% of user traffic?"',
        'Ask: "Are all management, logging, and threat intelligence subscriptions bundled or billed as add-on modules?"'
      ],
      recommendedPitchAngle: 'Achieve enterprise-grade threat prevention and wire-speed SSL inspection with predictable TCO and dedicated ASIC acceleration.'
    }
  };

  public static getBattlecard(competitor: string): CompetitiveBattlecard {
    return this.BATTLECARDS[competitor] || this.BATTLECARDS['Rubrik'];
  }

  public static generatePitchPack(deal: DealContext, solution: SizingSolutionOutput): ProposalPitchPack {
    const battlecard = this.getBattlecard(deal.primaryCompetitor);
    const dateStr = new Date().toLocaleDateString();

    const customerEmail = `Subject: Technical Proposal & Sizing Verdict: ${solution.environmentName} (${deal.partnerName})

Hi ${deal.customerName} Team,

Following our discovery and architecture review, ${deal.partnerName} has compiled the formal multi-pillar infrastructure design for ${solution.environmentName}.

Our objective is to deliver a high-performance, resilient foundation across compute, storage, wire-speed networking, and cyber recovery while eliminating closed proprietary lock-ins.

Key Highlights of the Proposed Solution:
1. Compute & Virtualization: ${solution.compute ? solution.compute.recommendedNodesCount + 'x ' + solution.compute.nodeModel + ' with guaranteed N+1 cluster survivability (' + solution.compute.cpuHeadroomPercent + '% CPU / ' + solution.compute.ramHeadroomPercent + '% RAM reserve)' : 'Standard Enterprise Compute'}.
2. Storage & Immutability: ${solution.storage ? solution.storage.targetPlatform + ' with guaranteed ' + solution.storage.effectiveDataReductionRatio + ':1 Data Reduction and certified S3 Object Lock ransomware immutability' : 'High-Performance NVMe'}.
3. Data Centre Fabric: ${solution.networking ? solution.networking.leafSwitchesNeeded + 'x ' + solution.networking.recommendedLeafModel + ' 25GbE ToR Leaf switches delivering wire-speed non-blocking fabric' : 'Dual 25G MLAG'}.
4. Edge Security: ${solution.security ? solution.security.applianceCount + 'x ' + solution.security.firewallModel + ' (' + solution.security.haArchitecture + ') with deep packet SSL/TLS inspection headroom' : 'Enterprise NGFW HA Pair'}.
5. Cyber Resilience: ${solution.resilience ? solution.resilience.resiliencePlatform + ' ' + solution.resilience.editionTier + ' protecting ' + solution.resilience.licensedUnitsRequired + ' ' + solution.resilience.licensingMetric + ' with local immutable WORM retention and cloud offsite archive' : 'Enterprise Backup'}.

Unlike closed architectures that mandate proprietary appliances and unpredictable renewal penalties, this design provides complete hardware sovereignty, standard enterprise components, and verified manufacturer SKUs backed by 24x7 4-Hour Mission Critical SLAs.

The full itemized distributor Bill of Materials (BOM) and technical sizing breakdown are attached for your commercial review.

We would welcome 20 minutes this week to walk through the technical sizing and answer any architectural questions.

Best regards,

Enterprise Solutions Architecture Team
${deal.partnerName} in partnership with Arrow ECS UK`;

    const executivePitch = `# Executive Partner Deal Strategy & Pitch Pack

**Customer:** ${deal.customerName}  
**Partner:** ${deal.partnerName}  
**Industry:** ${deal.customerIndustry.replace(/_/g, ' ')}  
**Incumbent Competitor:** ${deal.primaryCompetitor}  
**Date:** ${dateStr}  

---

### Winning Strategy against ${deal.primaryCompetitor}
${battlecard.recommendedPitchAngle}

### Competitive Displacement Hooks
${battlecard.displacementHooks.map(h => '- ' + h).join('\n')}

### Questions to Lay Landmines for ${deal.primaryCompetitor}
${battlecard.landminesToDrop.map(q => '- ' + q).join('\n')}

### Competitor Vulnerabilities
${battlecard.competitorWeaknesses.map(w => '- ' + w).join('\n')}
`;

    return {
      customerProposalEmail: customerEmail,
      executivePitchSummary: executivePitch,
      partnerBattlecard: battlecard
    };
  }
}
