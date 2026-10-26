# Networking Pillar Research Brief (Dell PowerSwitch & Arista Networks)

**Scope:** 25GbE Top-of-Rack (ToR) Leaf, 100GbE Spine switches, breakout cabling, oversubscription ratios, and fabric protocols.  
**Target Platform:** Enterprise Solution Builder v2.0  
**Date of Retrieval / Verification:** 2026-10-26  

---

## 1. Dell PowerSwitch (ToR Leaf & Spine Platforms)

### Dell PowerSwitch S5248F-ON (25GbE ToR Leaf Switch)
- **Role:** High-density Top-of-Rack (ToR) leaf switch for server compute and storage clustering.
- **Form Factor:** 1U fixed form factor.
- **Port Configurations:**
  - 48 x 25GbE SFP28 ports (server downlinks: compute nodes, storage targets).
  - 6 x 100GbE QSFP28 uplink ports (uplinks to spine fabric or breakout to 4x25GbE).
  - 2 x 100GbE QSFP28-DD ports (breakout to 2x100GbE or 8x25GbE).
- **Performance:**
  - Switching capacity: 4.0 Tbps (full duplex).
  - Forwarding rate: Up to 2,000 Mpps.
  - Latency: Sub-800ns cut-through switching.
- **Fabric Features:**
  - EVPN-VXLAN distributed overlay gateway.
  - RoCEv2 (RDMA over Converged Ethernet) with PFC (Priority Flow Control) and ECN (Explicit Congestion Notification) for NVMe-oF and storage traffic.
  - VLT (Virtual Link Trunking) for active-active multi-chassis LAG.
- **Cabling & Optics:**
  - Server links: Passive Direct Attach Copper (DAC) cables (1m, 2m, 3m, 5m), Active Optical Cables (AOC), or SFP28 SR transceivers.
  - Spine uplinks: 100G QSFP28 DAC (1m, 3m), AOC, or QSFP28 CWDM4 / SR4.
- **Datasheet Citation:**
  - Source: [Dell PowerSwitch S5200-ON Series Spec Sheet](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/poweredge-s5200-spec-sheet.pdf).

### Dell PowerSwitch Z9264F-ON (100GbE Spine Switch)
- **Role:** High-density 100GbE Spine switch for non-blocking leaf-spine fabrics.
- **Form Factor:** 2U fixed configuration.
- **Port Configurations:**
  - 64 x 100GbE QSFP28 ports (or up to 128 x 50GbE / 40GbE via breakout).
- **Performance:**
  - Switching capacity: 12.8 Tbps (full duplex non-blocking).
  - Forwarding rate: Up to 4,300 Mpps.
- **Oversubscription Sizing Metric:**
  - Standard enterprise leaf-spine ratio: 3:1 oversubscription (48x25G downlink = 1.2Tbps; 4x100G uplink = 400Gbps).
  - Low-latency / AI storage fabric ratio: 1:1 non-blocking (48x25G downlink = 1.2Tbps; 12x100G uplinks).
- **Datasheet Citation:**
  - Source: [Dell PowerSwitch Z9264F-ON Spec Sheet](https://www.delltechnologies.com/asset/en-us/products/networking/technical-support/dell-emc-powerswitch-z9264f-on-spec-sheet.pdf).

---

## 2. Arista Networks (7050X3 & 7060X Platforms)

### Arista 7050SX3-48YC8 (25GbE ToR Leaf Switch)
- **Role:** High-performance, low-latency Top-of-Rack data centre leaf switch.
- **Form Factor:** 1U wire-speed architecture running Arista EOS.
- **Port Configurations:**
  - 48 x 25GbE SFP28 ports.
  - 8 x 100GbE QSFP28 uplink ports (flexible breakout: 4x25GbE or 4x10GbE).
- **Performance:**
  - Switching capacity: 4.0 Tbps.
  - Forwarding rate: 2.0 Bpps.
  - Latency: Dynamic shared packet buffer (32MB), cut-through latency 800ns.
- **Advanced Networking Protocols:**
  - MLAG (Multi-Chassis Link Aggregation) for dual-homed server resilience.
  - EVPN-VXLAN L2/L3 multi-tenant overlay network virtualization.
  - RoCEv2 loss-less storage fabric profile (PFC, ECN, dynamic buffer allocation).
  - PTP (Precision Time Protocol IEEE 1588).
- **Datasheet Citation:**
  - Source: [Arista 7050X3 Series Data Sheet](https://www.arista.com/assets/data/pdf/Datasheets/7050X3-Datasheet.pdf).

### Arista 7060CX-32S / 7060X Spine Switch
- **Role:** High-density 100GbE spine interconnect switch.
- **Form Factor:** 1U fixed configuration.
- **Port Configurations:**
  - 32 x 100GbE QSFP28 ports (or 2 x 10GbE SFP+ management).
- **Performance:**
  - Switching capacity: 6.4 Tbps wire-speed.
  - Forwarding rate: 3.3 Bpps.
- **Datasheet Citation:**
  - Source: [Arista 7060X and 7260X Series Data Sheet](https://www.arista.com/assets/data/pdf/Datasheets/7060X_7260X_Datasheet.pdf).
