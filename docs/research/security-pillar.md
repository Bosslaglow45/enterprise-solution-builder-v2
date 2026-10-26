# Security Pillar Research Brief (Check Point Quantum, Fortinet FortiGate, Sophos XGS)

**Scope:** NGFW and Threat Prevention appliances, throughput benchmarks (Firewall, NGFW, Threat Prevention, SSL/TLS Inspection), session capacity, and High Availability (HA) clustering.  
**Target Platform:** Enterprise Solution Builder v2.0  
**Date of Retrieval / Verification:** 2026-10-26  

---

## 1. Fortinet FortiGate (Mid-Range & Enterprise NGFWs)

### FortiGate 200F / 201F
- **Target Workload:** Mid-enterprise campus perimeter, datacenter edge, and internal segmentation firewall.
- **Hardware Acceleration:** SOC4 (System on a Chip) & CP9 content processor ASIC acceleration.
- **Throughput Metrics:**
  - Firewall Throughput (UDP packets): 27 Gbps
  - IPS Throughput: 5 Gbps
  - NGFW Throughput: 3.5 Gbps
  - Threat Prevention Throughput (Firewall + IPS + Antivirus + Application Control): 3.0 Gbps
  - SSL/TLS Inspection Throughput: 4.0 Gbps
  - Concurrent Sessions: 3,000,000
  - New Sessions/Second: 280,000
- **Interfaces:** 16 x GE RJ45, 8 x 10GE SFP+ slots, dedicated HA port.
- **HA Clustering:** FGCP (FortiGate Clustering Protocol - Active-Passive / Active-Active), FGSP (FortiGate Session Life Protocol for asymmetric active-active routing).
- **Datasheet Citation:**
  - Source: [Fortinet FortiGate 200F Series Data Sheet](https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/fortigate-200f-series.pdf).

### FortiGate 600F / 601F
- **Target Workload:** Enterprise datacenter edge and core campus aggregation.
- **Hardware Acceleration:** NP7 (Network Processor 7) & CP9 content processor.
- **Throughput Metrics:**
  - Firewall Throughput: 139 Gbps
  - IPS Throughput: 14 Gbps
  - NGFW Throughput: 10.5 Gbps
  - Threat Prevention Throughput: 9.5 Gbps
  - SSL/TLS Inspection: 8.0 Gbps
  - Concurrent Sessions: 8,000,000
  - New Sessions/Second: 550,000
- **Interfaces:** 4 x 25GE SFP28, 4 x 10GE SFP+, 16 x GE RJ45.
- **Datasheet Citation:**
  - Source: [Fortinet FortiGate 600F Series Data Sheet](https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/fortigate-600f-series.pdf).

---

## 2. Check Point Quantum Security Gateways

### Quantum 6600 Security Gateway
- **Target Workload:** Mid-to-large enterprise branch and datacenter perimeter.
- **Security Rating / Throughput Metrics:**
  - SecurityPower Units (SPU): 17,200
  - Firewall Throughput (1518B UDP): 18.0 Gbps
  - NGFW Throughput (App Control + IPS): 6.2 Gbps
  - Threat Prevention Throughput (Gen V - IPS, AV, Anti-Bot, Threat Emulation Sandboxing): 3.7 Gbps
  - SSL/TLS Inspection Throughput: 3.3 Gbps
  - Concurrent Connections: 4,000,000
  - New Connections/Second: 160,000
- **Interfaces:** Up to 16 x 1GE RJ45, 8 x 10GE SFP+, optional 2 x 40GE QSFP+ or 4 x 25GE SFP28 expansion cards.
- **HA Clustering:** ClusterXL (High Availability Active-Passive, Load Sharing Active-Active), Sync interface with state synchronization.
- **Licensing Packages:** SandBlast Threat Prevention (SNBT), SandBlast Complete (SNBC).
- **Datasheet Citation:**
  - Source: [Check Point Quantum 6600 Security Gateway Datasheet](https://www.checkpoint.com/downloads/products/quantum-6600-security-gateway-datasheet.pdf).

---

## 3. Sophos XGS Series (Next-Gen Firewall Appliances)

### Sophos XGS 2300 / 3300
- **Architecture:** Xstream dual-processor architecture (Multi-core CPU for control plane & deep packet inspection + dedicated Xstream Flow Processor ASIC for fast-path hardware offload).
- **Throughput Metrics (XGS 2300):**
  - Firewall Throughput: 35.0 Gbps
  - IPS Throughput: 7.0 Gbps
  - NGFW Throughput: 4.5 Gbps
  - Threat Protection Throughput: 1.4 Gbps
  - SSL/TLS Inspection Throughput: 1.45 Gbps
  - Concurrent Connections: 6,500,000
  - New Connections/Second: 135,000
- **Throughput Metrics (XGS 3300):**
  - Firewall Throughput: 58.0 Gbps
  - Threat Protection Throughput: 2.77 Gbps
  - SSL/TLS Inspection: 3.12 Gbps
  - Concurrent Connections: 13,700,000
- **HA Clustering:** Active-Passive HA failover, Active-Active cluster load sharing.
- **Licensing Packages:** Standard Protection, Xstream Protection (includes Central Orchestration, Zero-Day Protection Sandstorm).
- **Datasheet Citation:**
  - Source: [Sophos XGS Series Appliances Datasheet](https://www.sophos.com/en-us/medialibrary/PDFs/factsheets/sophos-firewall-br.pdf).
