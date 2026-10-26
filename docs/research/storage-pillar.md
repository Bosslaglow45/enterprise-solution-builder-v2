# Storage Pillar Research Brief (Scality, PeaSoup, Wasabi, Dell PowerStore)

**Scope:** Enterprise Primary & Object Storage specifications, data reduction guarantees, immutability architectures, and sizing rules.  
**Target Platform:** Enterprise Solution Builder v2.0  
**Date of Retrieval / Verification:** 2026-10-26  

---

## 1. Dell PowerStore (1200T / 3200T / 5200T / 9200T)

- **Architecture:** Unified All-Flash Scale-Up and Scale-Out Active-Active dual-node appliance clustering (up to 4 appliances / 8 nodes per cluster).
- **Storage Types & Workloads:** Primary SAN (Block), NAS (File), and vVols.
- **Protocols Supported:**
  - Block: NVMe-oF (NVMe/TCP, NVMe/FC), Fibre Channel (32Gb/16Gb), iSCSI (10/25GbE).
  - File: NFS (v3, v4/v4.1), SMB (v2, v3).
- **Capacity Sizing & Expansion:**
  - Raw Base Drive Bays: 24 x 2.5" NVMe SSD slots per 2U base chassis.
  - Expansion Enclosures: 24-drive NVMe expansion enclosures (ENS24) per appliance.
  - Drive Capacities: 1.92TB, 3.84TB, 7.68TB, 15.36TB NVMe SSDs; SCM (Storage Class Memory) drive options for caching/metadata.
  - Usable Capacity per cluster: Up to 18.8 PB effective capacity across a 4-appliance cluster.
- **Data Reduction Guarantee:**
  - **4:1 Data Reduction Ratio (DRR)** guaranteed by Dell Future-Proof program across reducible data (inline deduplication and compression with hardware offload engine), without performance compromise.
- **High Availability & Fault Tolerance:** Dynamic Resiliency Engine (DRE) dual parity (tolerates up to 2 concurrent drive failures per appliance without traditional RAID group overhead).
- **Datasheet Citation:**
  - Source: [Dell PowerStore Specification Sheet](https://www.delltechnologies.com/asset/en-us/products/storage/technical-support/powerstore-family-spec-sheet.pdf) (Dell Technologies Documentation).

---

## 2. Scality ARTESCA & RING (On-Premises Object Storage)

- **Target Workloads:** Cloud-native applications, immutable backup repositories (Veeam, Commvault, Cohesity), Big Data, and AI pipelines.
- **Protocols Supported:** S3 REST API (comprehensive AWS S3 API fidelity), NFS/SMB (via SOFS gateway in RING).
- **Architecture Differences:**
  - **Scality ARTESCA:** Lightweight, single-server to multi-server distributed object store designed for enterprise edge and mid-market backup repositories. Starts from a single server (1 node) scale-up to distributed scale-out clusters (up to tens of Petabytes).
  - **Scality RING:** Petabyte-to-Exabyte scale distributed object and file architecture, minimum 3 to 6 storage nodes per ring, dual-site or multi-site geo-distributed topologies.
- **Data Protection & Erasure Coding:**
  - Advanced Erasure Coding schemes (e.g., 9+3, 8+4, 12+4) minimizing parity overhead to 25–33% while surviving multiple drive or full-node failures.
- **Immutability & Compliance:**
  - Native **S3 Object Lock** (Compliance & Governance modes with retention periods and legal hold).
  - Validated **Veeam Ready - Object with Immutability**.
  - Compliance certifications: SEC Rule 17a-4(f), FINRA Rule 4511, and CFTC 1.31(c)-(d).
- **Datasheet Citation:**
  - Source: [Scality ARTESCA Datasheet & Architecture Overview](https://www.scality.com/products/artesca/) and [Scality RING Technical Whitepaper](https://www.scality.com/products/ring/).

---

## 3. Wasabi Hot Cloud Storage (Offsite Cloud Object Target)

- **Architecture:** Globally distributed hyperscale public cloud object storage infrastructure (Tier IV datacenters across US, EMEA, APAC).
- **Target Workloads:** Cloud Tier / Offsite Immutable Archive for Veeam Scale-Out Backup Repositories (SOBR Capacity & Archive Tier), disaster recovery secondary copies.
- **Protocols Supported:** AWS S3 compatible REST API.
- **Immutability & Compliance:**
  - S3 Object Lock compliance; Object Lock retention cannot be shortened or bypassed even by root account credentials.
  - CJIS, HIPAA, FERPA, SOC 2 Type 2, ISO 27001 compliant.
- **Pricing & Consumption Metrics:**
  - Flat per-TB/month pricing model (typically $6.99/TB/month list).
  - **Zero egress fees and zero API call (PUT/GET/LIST) charges**, eliminating unpredictable operational bills during large-scale recovery operations.
  - Reserved Capacity Storage (RCS) option: 1-, 3-, or 5-year committed blocks with tiered volume discounts.
  - Minimum retention period policy: 90-day minimum storage retention for deleted objects.
- **Datasheet Citation:**
  - Source: [Wasabi Hot Cloud Storage Technical Specs & Pricing](https://wasabi.com/cloud-storage-pricing/).

---

## 4. PeaSoup Cloud (UK Sovereign Immutable S3 Cloud Storage)

- **Architecture:** Eco-friendly liquid-submerged infrastructure deployed in UK-based datacenters, providing UK sovereign data residency (GDPR compliance and strict UK regulatory governance).
- **Target Workloads:** Public sector, NHS, healthcare, and enterprise UK compliance archiving requiring UK sovereign data boundaries.
- **Protocols Supported:** S3 REST API compatible.
- **Immutability & Resiliency:**
  - Full S3 Object Lock compliance for ransomware-proof retention.
  - Veeam Cloud Connect & Direct-to-Object repository integration.
- **Pricing & Consumption Metrics:**
  - Fixed per-TB model with zero egress penalties and inclusive API transaction costs.
  - UK Data Sovereignty guarantee (no data transfer outside UK borders).
- **Datasheet Citation:**
  - Source: [PeaSoup Sovereign Cloud Infrastructure](https://peasoup.cloud/).
