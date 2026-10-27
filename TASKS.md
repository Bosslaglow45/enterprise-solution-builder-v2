# TASKS.md — Enterprise Solution Builder v2.0 Roadmap

Modular multi-vendor Bill of Materials (BOM) sizing engine spanning 5 core infrastructure pillars:
1. **Compute & Nodes:** Dell PowerEdge (R660, R760, R760xd2), Supermicro (2U high-density storage servers).
2. **Primary & Object Storage:** Scality (ARTESCA / RING S3 Object Lock), PeaSoup / Wasabi (cloud offsite), Dell PowerStore (primary SAN/NAS).
3. **Data Centre Networking:** Dell PowerSwitch & Arista (25GbE ToR Leaf, 100GbE Spine, DAC cabling).
4. **Edge & Perimeter Security:** Check Point Quantum / Infinity, Fortinet FortiGate, Sophos XGS (threat prevention throughput, HA pairs).
5. **Cyber Resilience:** Veeam Data Platform (VUL), Commvault Cloud, Cohesity.

---

## Phase 1: Architectural Foundation & Scaffolding
- [x] Create workspace at `D:\projects\enterprise-solution-builder-v2`
- [x] Establish `TASKS.md` roadmap
- [x] Scaffold extensible driver-based JSON schemas in `catalog/` for all 5 pillars:
  - [x] Compute & Nodes (`compute.schema.json`)
  - [x] Primary & Object Storage (`storage.schema.json`)
  - [x] Data Centre Networking (`networking.schema.json`)
  - [x] Edge & Perimeter Security (`security.schema.json`)
  - [x] Cyber Resilience (`resilience.schema.json`)
  - [x] Common driver metadata & base specification (`base-driver.schema.json`)

## Phase 2: Catalog Data Ingestion & Vendor Driver Profiles
- [x] **Compute Drivers & Research:**
  - [x] Dell PowerEdge profile: R660, R760, R760xd2 (`catalog/drivers/compute-dell.json`)
  - [x] Supermicro profile: SSG-221P-NECTR24R (`catalog/drivers/compute-supermicro.json`)
  - [x] Cited research brief (`docs/research/compute-pillar.md`)
- [x] **Storage Drivers & Research:**
  - [x] Dell PowerStore profile: 1200T, 3200T (`catalog/drivers/storage-dell.json`)
  - [x] Scality profile: ARTESCA & RING S3 Object Lock (`catalog/drivers/storage-scality.json`)
  - [x] Cloud offsite profile: Wasabi & PeaSoup (`catalog/drivers/storage-cloud.json`)
  - [x] Cited research brief (`docs/research/storage-pillar.md`)
- [x] **Networking Drivers & Research:**
  - [x] Dell PowerSwitch: S5248F-ON ToR & Z9264F-ON Spine (`catalog/drivers/networking-dell.json`)
  - [x] Arista: 7050SX3-48YC8 ToR & 7060CX-32S Spine (`catalog/drivers/networking-arista.json`)
  - [x] Cited research brief (`docs/research/networking-pillar.md`)
- [x] **Security Drivers & Research:**
  - [x] Fortinet: FortiGate 200F & 600F (`catalog/drivers/security-fortinet.json`)
  - [x] Check Point: Quantum 6600 (`catalog/drivers/security-checkpoint.json`)
  - [x] Sophos: XGS 2300 (`catalog/drivers/security-sophos.json`)
  - [x] Cited research brief (`docs/research/security-pillar.md`)
- [x] **Cyber Resilience Drivers & Research:**
  - [x] Veeam Data Platform: VUL instance sizing (`catalog/drivers/resilience-veeam.json`)
  - [x] Commvault Cloud: FETB & MediaAgent sizing (`catalog/drivers/resilience-commvault.json`)
  - [x] Cohesity DataProtect: SpanFS & DataLock (`catalog/drivers/resilience-cohesity.json`)
  - [x] Cited research brief (`docs/research/resilience-pillar.md`)

## Phase 3: Sizing Engine Core & Calculation Logic
- [x] Workload & Requirement Input Schema (`src/types/sizing.ts`):
  - [x] VM counts, vCPU:pCPU ratio, RAM allocation, IOPS, usable capacity, retention window, daily change rate.
- [x] Sizing Calculator Engine (`src/engine/calculator.ts`):
  - [x] Compute & RAM headroom with N+1/N+2 cluster survivability calculator.
  - [x] Storage effective capacity & usable RAID / Erasure Coding parity overhead engine (4:1 DRR support).
  - [x] Network port mapping & 3:1 leaf-spine bandwidth oversubscription engine.
  - [x] Firewall inspection throughput margin calculation with SSL inspection overhead.
  - [x] Backup retention, dedupe ratio, and local immutable + offsite cloud replication sizing.
- [x] Bill of Materials (BOM) Generator:
  - [x] Multi-vendor SKU and line item aggregation.
  - [x] Automated end-to-end integration test suite (`scripts/test-sizing-engine.cjs`).

## Phase 4: UI Scaffolding, Solution Export & Channel Quoting Engine
- [x] Distributor-grade SKU and licensing dictionary across all 5 pillars (`docs/research/vendor-licensing-and-skus.md`).
- [x] Cross-validation rules (airflow matching, DAC distance limits, DRE drive minimums, 10-pack VUL rounding).
- [x] Interactive configuration wizard & UI dashboard (`ui/index.html`).
- [x] Real-time BOM generation table with multi-vendor pillar categorization.
- [x] Multi-format export services (`src/export/exporter.ts`):
  - [x] RFC 4180 standard CSV BOM export (`SolutionExporter.toCsvBom`).
  - [x] Customer Executive Summary in Markdown (`SolutionExporter.toExecutiveSummary`).
  - [x] Comprehensive export test suite (`scripts/test-solution-exporter.cjs`).
