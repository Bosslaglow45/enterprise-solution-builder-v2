# Enterprise Infrastructure SKU & Licensing Reference Manual

**Target:** Enterprise Solution Builder v2.0  
**Scope:** Orderable Part Numbers, Subscription Licensing Metrics, Support Packs, and Sizing SKUs across all 5 Pillars.  
**Date of Retrieval / Verification:** 2026-10-27  

---

## Pillar 1: Cyber Resilience & Immutable Backup

### 1. Veeam Data Platform (V12.2 / VDP)
- **Licensing Metric:** Veeam Universal License (VUL) per-workload instance subscription. Sold in 5-instance and 10-instance packs.
- **Editions & Product Capabilities:**
  - **Foundation:** Veeam Backup & Replication core enterprise engine.
  - **Advanced:** Backup & Replication + Veeam ONE deep infrastructure monitoring, analytics & capacity planning.
  - **Premium:** Backup & Replication + Veeam ONE + Veeam Recovery Orchestrator (VRO) automated DR testing and failover runbooks.
- **Orderable Distributor SKUs:**
  - `V-VULPRM-0I-SU1YP-00`: Veeam Data Platform Premium - 1 Year Subscription (per instance, Production 24x7 support included).
  - `V-VULPRM-0I-SU3YP-00`: Veeam Data Platform Premium - 3 Year Upfront Subscription.
  - `V-VULPRM-0I-SU5YP-00`: Veeam Data Platform Premium - 5 Year Upfront Subscription.
  - `V-VULADV-0I-SU1YP-00`: Veeam Data Platform Advanced - 1 Year Subscription (per instance).
  - `V-VULADV-0I-SU3YP-00`: Veeam Data Platform Advanced - 3 Year Subscription (per instance).
  - `V-VULADV-0I-SU5YP-00`: Veeam Data Platform Advanced - 5 Year Subscription (per instance).
  - `V-VULFND-0I-SU1YP-00`: Veeam Data Platform Foundation - 1 Year Subscription (per instance).
  - `P-VBOM36-0U-SU1YP-00`: Veeam Backup for Microsoft 365 - 1 Year Subscription (per user).
  - `P-VBOM36-0U-SU3YP-00`: Veeam Backup for Microsoft 365 - 3 Year Subscription (per user).
- **Conversion Math:**
  - 1 VUL = 1 VM (vSphere/Hyper-V/AHV)
  - 1 VUL = 1 Physical Server (Windows/Linux)
  - 1 VUL = 3 Physical Workstations
  - 1 VUL = 500 GB Enterprise NAS/File Share
- **Citation:** [Veeam Licensing Policy & Product Catalog](https://www.veeam.com/licensing-policy.html).

### 2. Commvault Cloud
- **Licensing Metrics:**
  - **Front-End Terabyte (FETB):** Logical volume of protected data before compression/deduplication.
  - **Workload Instance:** Per VM or cloud instance.
- **Orderable SKUs:**
  - `CV-BR-ADV-1T-1Y`: Commvault Complete Backup & Recovery Advanced - 1 Year Subscription per Front-End TB.
  - `CV-BR-ADV-1T-3Y`: Commvault Complete Backup & Recovery Advanced - 3 Year Subscription per Front-End TB.
  - `CV-AGP-AZ-1T-1Y`: Commvault Air Gap Protect (integrated immutable Azure cloud storage) - 1 Year per TB.
- **Citation:** [Commvault Licensing Guide](https://www.commvault.com/pricing).

### 3. Cohesity DataProtect
- **Licensing Metric:** Usable protected capacity (TB) or node consumption.
- **Orderable SKUs:**
  - `CP-DP-SW-TB-1Y`: Cohesity DataProtect Software Subscription - 1 Year per Usable TB.
  - `CP-DP-SW-TB-3Y`: Cohesity DataProtect Software Subscription - 3 Year per Usable TB.
  - `CP-FK-VAULT-1T-1Y`: Cohesity FortKnox Cloud Cyber Recovery Vault - 1 Year per TB.
- **Citation:** [Cohesity DataProtect Datasheet](https://www.cohesity.com/products/dataprotect/).

---

## Pillar 2: Edge & Perimeter Security (NGFW)

### 1. Fortinet FortiGate
- **Appliance Hardware SKUs:**
  - `FG-200F`: FortiGate 200F 1U NGFW Appliance (16x GE RJ45, 8x 10GE SFP+).
  - `FG-201F`: FortiGate 201F 1U Appliance with integrated 480GB NVMe SSD for on-box logging.
  - `FG-600F`: FortiGate 600F 1U Enterprise NGFW (4x 25GE SFP28, 4x 10GE SFP+, 16x GE RJ45).
- **Security Subscription & Support Bundles (FortiCare Premium + Services):**
  - `FC-10-00200-950-02-12`: FortiGate 200F 1-Year Unified Threat Protection (UTP) Bundle (IPS, Advanced Malware, App Control, Web Filtering, 24x7 FortiCare).
  - `FC-10-00200-950-02-36`: FortiGate 200F 3-Year Unified Threat Protection (UTP) Bundle.
  - `FC-10-00200-811-02-12`: FortiGate 200F 1-Year Enterprise Protection Bundle (UTP + IoT Detection + Security Rating).
  - `FC-10-00600-950-02-12`: FortiGate 600F 1-Year Unified Threat Protection (UTP) Bundle.
  - `FC-10-00600-950-02-36`: FortiGate 600F 3-Year Unified Threat Protection (UTP) Bundle.
- **Transceivers & Cabling SKUs:**
  - `FN-TRAN-SFP28-SR`: Fortinet 25GE SFP28 Short Reach optical transceiver.
  - `FN-TRAN-SFP+SR`: Fortinet 10GE SFP+ Short Reach optical transceiver.
  - `FN-CABLE-SFP28-1M`: Fortinet 25GbE SFP28 1m Direct Attach Copper (DAC) cable.
  - `FN-CABLE-SFP28-3M`: Fortinet 25GbE SFP28 3m Direct Attach Copper (DAC) cable.
- **Citation:** [Fortinet FortiGate Ordering Guide](https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/fortigate-200f-series.pdf).

### 2. Check Point Quantum
- **Appliance Bundles with SandBlast Threat Prevention:**
  - `CPAP-SG6600-SNBT-2Y`: Check Point Quantum 6600 Gateway with 2-Year SandBlast Threat Prevention (SNBT) + Direct Enterprise Support.
  - `CPAP-SG6600-SNBC-3Y`: Check Point Quantum 6600 Gateway with 3-Year SandBlast Complete (SNBC) + Zero-Day Threat Extraction.
  - `CPAC-2-10FSR-B`: 2-Port 10G SFP+ optical transceiver pack.
- **Citation:** [Check Point Quantum 6600 Datasheet](https://www.checkpoint.com/downloads/products/quantum-6600-security-gateway-datasheet.pdf).

### 3. Sophos XGS
- **Appliance Hardware & Licensing Bundles:**
  - `XB231CSAA`: Sophos XGS 2300 Appliance (EU/UK/US power cord).
  - `XB231ETPA`: Sophos XGS 2300 1-Year Xstream Protection Subscription (Network, Web, Zero-Day, Central Orchestration).
  - `XB233ETPA`: Sophos XGS 2300 3-Year Xstream Protection Subscription.
- **Citation:** [Sophos XGS Ordering Catalog](https://www.sophos.com/en-us/medialibrary/PDFs/factsheets/sophos-firewall-br.pdf).

---

## Pillar 3: Primary & Object Storage

### 1. Dell PowerStore (1200T, 3200T)
- **Base Array Order Codes:**
  - `210-AXEJ`: Dell PowerStore 1200T Base Appliance (Dual Active-Active Node Chassis).
  - `210-AXEK`: Dell PowerStore 3200T Base Appliance.
- **Drive Packs (NVMe SSD):**
  - `400-BLXQ`: 6x 1.92TB NVMe SSD Drive Pack (Base DRE RAID array).
  - `400-BLXR`: 6x 3.84TB NVMe SSD Drive Pack.
  - `400-BLXS`: 6x 7.68TB NVMe SSD Drive Pack.
  - `400-BLXT`: 6x 15.36TB NVMe SSD Drive Pack.
- **Host Connectivity I/O Modules:**
  - `384-BDZS`: 4-Port 25GbE Optical / SFP28 I/O Module (pairs per node).
  - `384-BDZT`: 4-Port 32Gb Fibre Channel I/O Module.
- **Support SLAs:**
  - `865-9832`: Dell ProSupport Plus 24x7 4-Hour On-Site Service - 3 Year.
  - `865-9834`: Dell ProSupport Plus 24x7 4-Hour On-Site Service - 5 Year.
- **Citation:** [Dell PowerStore Configuration & Ordering Guide](https://www.delltechnologies.com/asset/en-us/products/storage/technical-support/powerstore-family-spec-sheet.pdf).

### 2. Scality ARTESCA & RING
- **Software Subscription Licences:**
  - `ART-LIC-SUB-100T-1Y`: Scality ARTESCA 100 TB S3 Object Storage Software Subscription - 1 Year (WORM S3 Object Lock included).
  - `ART-LIC-SUB-100T-3Y`: Scality ARTESCA 100 TB S3 Object Storage Software Subscription - 3 Year.
  - `RNG-LIC-SUB-1PB-1Y`: Scality RING Unified Object & File Subscription - 1 PB Block 1-Year.
- **Citation:** [Scality Product Licensing](https://www.scality.com/products/artesca/).

### 3. Wasabi & PeaSoup Cloud
- **Wasabi Hot Cloud Storage:**
  - `WASABI-RCS-25T-1Y`: Reserved Capacity Storage 25 TB block - 1 Year Prepaid ($0 egress, $0 API).
  - `WASABI-RCS-100T-3Y`: Reserved Capacity Storage 100 TB block - 3 Year Prepaid.
- **PeaSoup UK Sovereign Cloud:**
  - `PS-S3-UK-10T-1Y`: PeaSoup Sovereign S3 Immutable Repository - 10 TB Tier 1-Year Prepaid.
- **Citation:** [Wasabi Reserved Capacity Sizing](https://wasabi.com/cloud-storage-pricing/) and [PeaSoup Cloud](https://peasoup.cloud/).

---

## Pillar 4: Compute & Hypervisor Nodes

### 1. Dell PowerEdge (R660, R760, R760xd2)
- **Base Orderable Configurations:**
  - `210-BDFY`: PowerEdge R760 Rack Server Base Chassis (2U, up to 24x 2.5" NVMe bays).
  - `210-BDFX`: PowerEdge R660 Rack Server Base Chassis (1U, up to 10x 2.5" bays).
  - `210-BDGZ`: PowerEdge R760xd2 High-Capacity Storage Server (2U, up to 28x 3.5" bays).
- **Flagship Processors:**
  - `338-CHTT`: Intel Xeon Gold 6448Y 2.1G, 32C/64T, 16GT/s, 60M Cache, Turbo, HT (225W) DDR5-4800.
  - `338-CHTU`: Intel Xeon Platinum 8480+ 2.0G, 56C/112T, 16GT/s, 105M Cache, Turbo (350W).
  - `338-CJMQ`: Intel Xeon Platinum 8592+ 1.9G, 64C/128T, 16GT/s, 320M Cache, Turbo (350W) DDR5-5600.
- **Memory & Storage Kits:**
  - `370-AGVP`: 64GB RDIMM, 5600MT/s Dual Rank (DDR5).
  - `370-AGVR`: 128GB RDIMM, 5600MT/s Quad Rank.
  - `528-CRWS`: iDRAC9 Datacenter 16G with OpenManage Enterprise Advanced Plus.
  - `403-BCMN`: BOSS-N1 Controller card with Dual M.2 480GB NVMe SSDs in RAID1 (OS Boot).
- **Support SLAs:**
  - `865-9801`: ProSupport Plus with 4-Hour 24x7 Mission Critical On-Site Service - 3 Year.
  - `865-9803`: ProSupport Plus with 4-Hour 24x7 Mission Critical On-Site Service - 5 Year.
- **Citation:** [Dell PowerEdge R760 Technical Guide](https://www.delltechnologies.com/asset/en-us/products/servers/technical-support/poweredge-r760-spec-sheet.pdf).

### 2. Supermicro SuperServer
- **System SKU:**
  - `SYS-221P-NECTR24R`: SuperServer 2U Dual Socket LGA-4677, 24x 2.5" NVMe/SAS drive bays, 2x 2600W Titanium PSUs.
  - `AOM-A25G-m2S`: Dual-Port 25GbE AIOM (OCP 3.0 compatible) Mezzanine Card.
- **Citation:** [Supermicro SuperServer SSG-221P-NECTR24R](https://www.supermicro.com/en/products/system/storage/2u/ssg-221p-nectr24r).

---

## Pillar 5: Data Centre Networking

### 1. Dell PowerSwitch
- **Switch Hardware SKUs:**
  - `210-ARXQ`: Dell PowerSwitch S5248F-ON (48x 25GbE SFP28, 6x 100GbE QSFP28, 2x 100GbE QSFP-DD, Dual AC PSUs, I/O to PSU airflow).
  - `210-ARYB`: Dell PowerSwitch Z9264F-ON (64x 100GbE QSFP28, Dual AC, Front-to-Rear Airflow).
- **Cabling & Transceiver SKUs:**
  - `470-ACFC`: Dell Networking Cable, 25GbE SFP28 Direct Attach Copper (DAC), 2m.
  - `470-ACFD`: Dell Networking Cable, 25GbE SFP28 Direct Attach Copper (DAC), 3m.
  - `470-ABQY`: Dell Networking Cable, 100GbE QSFP28 to QSFP28 Direct Attach Copper (DAC), 1m.
  - `470-ABQZ`: Dell Networking Cable, 100GbE QSFP28 to QSFP28 Direct Attach Copper (DAC), 3m.
- **Citation:** [Dell PowerSwitch S5200 Series Ordering Guide](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/poweredge-s5200-spec-sheet.pdf).

### 2. Arista Networks
- **Switch Hardware SKUs:**
  - `DCS-7050SX3-48YC8-F`: Arista 7050X3, 48x 25GbE SFP & 8x 100GbE QSFP switch, Front-to-Rear airflow, Dual AC power supplies.
  - `DCS-7060CX-32S-F`: Arista 7060X, 32x 100GbE QSFP switch, Front-to-Rear airflow, Dual AC.
- **Software Licences & Cabling:**
  - `LIC-FIX-2-E`: Arista Enhanced L3 License (OSPF, BGP, EVPN-VXLAN).
  - `CAB-SFP28-3M`: Arista 25G SFP28 Direct Attach Copper Cable 3m.
  - `CAB-Q-Q-100G-3M`: Arista 100G QSFP28 Direct Attach Copper Cable 3m.
- **Citation:** [Arista 7050X3 Ordering Catalog](https://www.arista.com/assets/data/pdf/Datasheets/7050X3-Datasheet.pdf).
