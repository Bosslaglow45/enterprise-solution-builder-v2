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
- [ ] Implement driver manifest registry (`catalog/drivers.json`)

## Phase 2: Catalog Data Ingestion & Vendor Driver Profiles
- [ ] **Compute Drivers & Catalog Data:**
  - [ ] Dell PowerEdge profile: R660 (1U dense compute), R760 (2U standard), R760xd2 (high-capacity storage node)
  - [ ] Supermicro profile: 2U high-density storage / multi-node chassis
- [ ] **Storage Drivers & Catalog Data:**
  - [ ] Scality ARTESCA & RING object store profiles (capacity, tiering, S3 Object Lock compliance)
  - [ ] PeaSoup & Wasabi cloud offsite tier pricing / egress models
  - [ ] Dell PowerStore SAN/NAS block/file sizing (effective vs. raw, dedupe/compression assumptions)
- [ ] **Networking Drivers & Catalog Data:**
  - [ ] Dell PowerSwitch (ToR S5200 series) & Arista 7050X / 7060X profiles
  - [ ] Port oversubscription, breakout cabling (QSFP28 100G to 4x25G SFP28), DAC/AOC compatibility
- [ ] **Security Drivers & Catalog Data:**
  - [ ] Check Point Quantum / Infinity (Security Gateway sizing, NGFW / TP throughput tiers, cluster HA)
  - [ ] Fortinet FortiGate (FortiOS NGFW/Threat Prevention sizing, FGSP/FGCP HA pairs)
  - [ ] Sophos XGS (Xstream architecture, TLS inspection overhead, HA)
- [ ] **Cyber Resilience Drivers & Catalog Data:**
  - [ ] Veeam Data Platform (VUL instance calculations, repository sizing, SOBR tiering)
  - [ ] Commvault Cloud workload licensing & MediaAgent sizing
  - [ ] Cohesity SmartFiles / DataProtect node calculations

## Phase 3: Sizing Engine Core & Calculation Logic
- [ ] Workload & Requirement Input Schema:
  - [ ] VM counts, vCPU:pCPU ratio, RAM allocation, IOPS, usable capacity, retention window, daily change rate.
- [ ] Sizing Calculator Service:
  - [ ] Compute & RAM headroom / N+1 cluster survivability calculator.
  - [ ] Storage effective capacity & usable RAID / Erasure Coding parity overhead engine.
  - [ ] Network port mapping & bandwidth aggregation engine.
  - [ ] Firewall inspection throughput margin calculation (peak vs nominal with SSL inspection).
  - [ ] Backup retention, dedupe ratio, and local immutable + offsite cloud replication sizing.
- [ ] BOM Generator:
  - [ ] Part number / SKU aggregation.
  - [ ] Multi-vendor cross-validation rules (e.g., transceiver compatibility, power consumption/PDU checks).

## Phase 4: UI Scaffolding & Solution Export
- [ ] Interactive configuration wizard (multi-step pillar input).
- [ ] Real-time BOM generation table with itemized pricing / SKU breakdown.
- [ ] Multi-format export: Excel/CSV BOM, Customer Executive Summary (PDF/Markdown), Architecture Diagram metadata.
