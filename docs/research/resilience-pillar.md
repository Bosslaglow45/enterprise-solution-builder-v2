# Cyber Resilience Pillar Research Brief (Veeam, Commvault, Cohesity)

**Scope:** Workload licensing models, proxy/repository compute sizing formulas, data deduplication ratios, and immutability architectures.  
**Target Platform:** Enterprise Solution Builder v2.0  
**Date of Retrieval / Verification:** 2026-10-26  

---

## 1. Veeam Data Platform (V12 / V12.2)

### Licensing & Workload Sizing
- **Licensing Model:** Veeam Universal License (VUL) per-instance subscription.
- **Conversion / Instance Sizing Ratios:**
  - 1 VUL instance = 1 Virtual Machine (VMware vSphere, Microsoft Hyper-V, Nutanix AHV).
  - 1 VUL instance = 1 Physical Server (Windows/Linux) or Cloud VM (AWS EC2, Azure VM, Google Cloud Engine).
  - 1 VUL instance = 3 Physical Workstations.
  - 1 VUL instance = 500 GB of Enterprise NAS / File Share capacity.
  - Microsoft 365: Sold as dedicated per-user/month licensing (Exchange, SharePoint, OneDrive, Teams).
- **Architecture & Proxy / Repository Sizing Formulas:**
  - **Backup Proxy Sizing:** 1 vCPU core and 2 GB RAM per concurrent backup task (1 VM disk = 1 task). Default recommendation: 8 vCPU cores, 16 GB RAM for a standard proxy handling 8 concurrent tasks.
  - **Repository Sizing:** 1 core and 4 GB RAM per concurrent task on the repository gateway.
  - **Deduplication & Compression Ratio:** 2.5:1 to 3.0:1 typical reduction ratio on standard enterprise virtualization workloads.
- **Immutability Architecture:**
  - **Hardened Linux Repository (HLR):** Native immutable backups on local physical servers (e.g. Dell PowerEdge R760xd2 running Ubuntu/RHEL with single-use credentials and XFS block cloning).
  - **Object Storage (Direct & SOBR):** Direct-to-Object S3 and Scale-Out Backup Repository (SOBR) Capacity/Archive tiers with S3 Object Lock compliance.
- **Datasheet Citation:**
  - Source: [Veeam Data Platform Architecture & Sizing Guide](https://www.veeam.com/data-platform.html).

---

## 2. Commvault Cloud

### Licensing & Architecture
- **Licensing Models:**
  - Front-End Terabyte (FETB): Total source logical data protected across enterprise workloads.
  - Workload Instance Licensing: Per VM, Per Cloud Instance, or Per User (SaaS M365/Salesforce).
- **Core Infrastructure (MediaAgent Sizing):**
  - **MediaAgent Node:** Core data mover and deduplication engine. Sizing: 8 to 16 CPU cores, 32 GB to 64 GB RAM, dedicated NVMe/SAS SSD DDB (Deduplication Database) cache.
  - **DDB Cache Rule:** ~20 GB NVMe SSD cache per 1 TB of Front-End protected data.
  - **Deduplication Ratio:** Up to 4.0:1 data reduction (block-level variable deduplication).
- **Immutability & Air Gap Protect:**
  - Commvault Air Gap Protect (integrated hyperscale cloud storage powered by Microsoft Azure / AWS with automated immutable air-gapping).
  - WORM storage locking and Dual-Key Authorization for sensitive destructive actions.
- **Datasheet Citation:**
  - Source: [Commvault Cloud Platform Overview](https://www.commvault.com/platform).

---

## 3. Cohesity (DataProtect & SmartFiles)

### Architecture & Licensing
- **Architecture:** Web-scale, scale-out hyperconverged backup and secondary data platform (SpanFS distributed filesystem). Minimum 3 nodes per cluster.
- **Licensing Model:** Usable capacity consumption (TB) or per-VM/instance subscription.
- **Node Specs & Sizing:**
  - Each Cohesity node (e.g. C3000 / C4000 series or certified Dell/Cisco platforms) provides distributed compute, RAM, NVMe/SSD write cache, and high-density HDD capacity tier.
- **Data Reduction:**
  - Global variable-length deduplication and compression across the entire cluster (typically 3.0:1 to 5.0:1 reduction).
- **Cyber Resilience & Immutability:**
  - **DataLock:** Write Once, Read Many (WORM) policy with strict time-bound retention locks that cannot be modified by any admin.
  - **FortKnox:** Cloud-isolated immutable cyber recovery vault.
  - Multi-party quorum approval for policy modifications.
- **Datasheet Citation:**
  - Source: [Cohesity DataProtect Solution Brief](https://www.cohesity.com/products/dataprotect/).
