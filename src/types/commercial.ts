/**
 * Commercial & Competitive Deal Intelligence Types
 * Enterprise Solution Builder v2.0
 */

export interface DealContext {
  partnerName: string; // e.g. Softcat, Computacenter, Bytes, SCC, Arrow ECS Partner
  customerName: string;
  customerIndustry: 'Financial_Services' | 'Healthcare_NHS' | 'Public_Sector' | 'Manufacturing' | 'Legal_Professional' | 'Retail';
  companySize: 'Mid_Market_100_500' | 'Enterprise_500_2500' | 'Large_Enterprise_2500_Plus';
  primaryCompetitor: 'Rubrik' | 'Cohesity' | 'Dell_PowerProtect' | 'VMware_Broadcom' | 'Palo_Alto' | 'HPE_GreenLake' | 'Commvault';
}

export interface CompetitiveBattlecard {
  competitor: string;
  competitorWeaknesses: string[];
  displacementHooks: string[];
  landminesToDrop: string[];
  recommendedPitchAngle: string;
}

export interface ProposalPitchPack {
  customerProposalEmail: string;
  executivePitchSummary: string;
  partnerBattlecard: CompetitiveBattlecard;
}
