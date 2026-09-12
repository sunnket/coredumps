(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "internet-of-things",
      why: {
        before: "Physical devices, industrial machines, home appliances, and environmental sensors operated as isolated, offline physical systems requiring human manual inspection and physical dials to monitor.",
        problem: "Manual data collection was slow, expensive, and error-prone; operational failures could not be predicted in real time, and remote automated control of distributed physical assets was impossible.",
        shift: "The Internet of Things (IoT) embedded microcontrollers, low-power radios, and sensors into everyday physical objects, establishing bi-directional telemetry and actuation pipelines between physical hardware and cloud platforms."
      },
      num: {
        t: "IoT Communication Protocols & Network Topologies",
        h: ["Protocol / Standard", "Transport & Wire Layer", "Data Overhead / Packet Size", "Power Consumption", "Primary Application Domain"],
        r: [
          ["MQTT (v3.1.1 / v5.0)", "TCP/IP with TLS", "Extremely Low (2-byte fixed header)", "Low to Moderate (requires persistent TCP socket)", "Industrial telemetry, smart home automation, connected vehicles"],
          ["CoAP (RFC 7252)", "UDP / Datagram DTLS", "Ultra-low (4-byte binary header; RESTful model)", "Very Low (sleep-friendly stateless datagrams)", "Constrained sensor networks, smart metering, battery-powered probes"],
          ["LoRaWAN", "Sub-GHz RF (868/915 MHz)", "Payload 51 - 222 bytes", "Ultra-Low (10-year battery life on coin cell)", "Agricultural soil monitoring, smart city utilities, asset tracking across 15 km"],
          ["BLE (Bluetooth Low Energy)", "2.4 GHz ISM band", "Payload up to 251 bytes (Bluetooth 5)", "Ultra-Low (microamps during sleep)", "Wearables, medical health trackers, indoor beacon localization"],
          ["Matter / Thread", "IPv6 over 6LoWPAN / 802.15.4 mesh", "Standard IPv6 packet fragmentation", "Low (mesh routing extends battery life)", "Unified cross-vendor smart home devices (Apple, Google, Amazon)"]
        ],
        n: "The Internet of Things spans a multi-tiered architecture: Perception (sensors detecting temperature, acceleration, pressure), Network/Edge (gateways translating fieldbus/radio protocols into IP traffic), and Cloud/Application (time-series databases, digital twins, and ML anomaly detection). Because edge sensors often operate on constrained microcontrollers (tens of kilobytes of RAM) powered by coin-cell batteries, traditional heavy web protocols (HTTP/1.1 with verbose JSON over TLS) are unviable due to high transmission overhead and TCP handshake battery drain. Lightweight protocols like MQTT employ a publish-subscribe broker architecture with Quality of Service levels (QoS 0: At most once, QoS 1: At least once, QoS 2: Exactly once) and persistent sessions, allowing devices to transmit binary telemetry and immediately re-enter deep-sleep low-power modes."
      },
      miss: [
        {
          w: "IoT is just putting an HTTP REST API server on a toaster or lightbulb.",
          r: "HTTP/1.1 and TLS handshakes consume hundreds of times too much power, bandwidth, and RAM for battery-operated constrained devices; IoT uses binary, publish-subscribe protocols like MQTT or CoAP."
        },
        {
          w: "All IoT sensor telemetry should be streamed uncompressed and raw directly to the cloud.",
          r: "Streaming raw high-frequency telemetry (e.g. 10 kHz vibration data) to the cloud exhausts cellular bandwidth and causes massive cloud ingestion bills; edge computing filters and aggregates data locally."
        },
        {
          w: "Consumer IoT devices are secure by default because they operate inside home Wi-Fi networks.",
          r: "Consumer IoT devices are notoriously vulnerable (hardcoded credentials, unencrypted telemetry, lack of firmware updates), frequently hijacked into massive global DDoS botnets (e.g. Mirai)."
        },
        {
          w: "IoT devices always maintain continuous, 24/7 internet connectivity.",
          r: "Real-world industrial and agricultural IoT devices operate on intermittent, lossy connections; firmware must buffer telemetry locally in non-volatile flash and handle offline reconnects gracefully."
        }
      ],
      trade: {
        buys: [
          "Real-time physical observability: continuous telemetry from thousands of assets enables predictive maintenance and fault detection.",
          "Automated remote actuation: control physical valves, thermostats, and robots remotely from cloud control planes.",
          "Operational cost reduction: replaces manual meter readers and visual field inspections with automated telemetry.",
          "New data-driven business models: enables equipment-as-a-service, dynamic insurance pricing, and smart energy grid balancing."
        ],
        costs: [
          "Massive cybersecurity attack surface: millions of exposed endpoints vulnerable to remote firmware hijacking and botnets.",
          "Data volume ingestion deluge: handling millions of telemetry points per second requires high-throughput time-series databases.",
          "Fleet management complexity: orchestrating Over-The-Air (OTA) firmware updates to millions of devices without bricking them.",
          "Hardware longevity mismatch: cloud software updates every week, while physical IoT hardware is expected to last 10-15 years."
        ],
        avoid: [
          "Shipping IoT devices with default, unchangeable admin passwords or exposed Telnet/SSH ports.",
          "Using HTTP polling on battery-powered edge devices instead of interrupt-driven MQTT or CoAP datagrams.",
          "Failing to implement cryptographic signature verification for Over-The-Air (OTA) firmware binaries.",
          "Ingesting high-frequency raw telemetry directly into transactional relational databases instead of time-series stores."
        ]
      }
    },
    {
      slug: "edge-computing",
      why: {
        before: "The centralized cloud computing paradigm dictated sending all sensor telemetry, video feeds, and user inputs to centralized cloud datacenters (AWS, Azure, GCP) for processing and storage.",
        problem: "Backhauling massive data streams incurred crippling bandwidth costs; round-trip network latency (50-200 ms) was too slow for autonomous vehicles and robotics; and internet outages halted local operations.",
        shift: "Edge Computing decentralizes computation, placing high-performance processing, storage, and ML inference physically adjacent to the data source (on local gateways, 5G base stations, or on-device chips) to achieve sub-millisecond latency and offline autonomy."
      },
      num: {
        t: "Edge Computing Tiers: Latency, Compute & Topology",
        h: ["Edge Deployment Tier", "Physical Location", "Network Round-Trip Latency", "Compute Hardware Profile", "Primary Application Workload"],
        r: [
          ["Device / On-Chip Edge", "Directly on sensor/camera (SoC, NPU)", "< 1 ms (direct bus / PCIe)", "Ultra-low-power NPUs, ARM Cortex-M/A, Coral TPU", "Real-time computer vision, acoustic anomaly detection, wake-word"],
          ["On-Premises / Near Edge", "Local factory floor gateway, server rack, retail store", "1 - 5 ms (local Gigabit LAN)", "Industrial PCs, NVIDIA Jetson, compact x86 servers", "Factory robotics control, local video analytics, PLC orchestration"],
          ["Network / Far Edge (MEC)", "5G cellular base stations, telecom central offices", "5 - 15 ms (5G UPF edge breakout)", "Telco blade servers, GPU acceleration clusters", "Autonomous vehicle V2X coordination, cloud gaming, AR headsets"],
          ["Centralized Cloud", "Regional hyperscale datacenters (e.g. us-east-1)", "50 - 200 ms (public internet WAN)", "Massive multi-node clusters, distributed cloud storage", "Global data aggregation, long-term analytics, foundational AI training"]
        ],
        n: "Edge computing fundamentally reorganizes the distributed topology of data processing by shifting computation towards the logical and physical periphery of the network. Driven by the physics of latency (light traveling through fiber optic cable is bounded at $\\approx 5 \\mu\\text{s}$ per kilometer, plus router hop latencies) and economic bandwidth constraints, edge computing acts as a smart filter. In an autonomous vehicle or automated manufacturing line, decisions must occur within 5 to 10 milliseconds to prevent physical collisions or assembly defects; waiting for a transatlantic round-trip HTTP request to a cloud datacenter is unviable. Modern edge architectures run containerized workloads (via lightweight runtimes like K3s or Docker) and optimized AI inference engines (TensorRT, ONNX Runtime) at the local gateway, syncing only aggregated summaries, anomalies, and model telemetry back to the centralized cloud."
      },
      miss: [
        {
          w: "Edge computing is a replacement for centralized cloud computing and will make cloud datacenters obsolete.",
          r: "Edge and cloud are complementary: the edge handles real-time, low-latency filtering and immediate actuation; the central cloud handles aggregate analytics, multi-region coordination, and heavy model training."
        },
        {
          w: "Edge computing simply means running a CDN (Content Delivery Network) for static web files.",
          r: "CDNs cache static assets; edge computing executes complex dynamic computation, stateful container orchestration, database transactions, and real-time AI inference at the network edge."
        },
        {
          w: "Deploying software to edge devices is identical to deploying to cloud Kubernetes clusters.",
          r: "Edge devices suffer intermittent power loss, unstable connectivity, asymmetric hardware, and physical tampering risks, requiring resilient offline-first deployment architectures."
        },
        {
          w: "Edge computing devices are always low-power, tiny microcontroller chips.",
          r: "Edge deployments range from microcontrollers to ruggedized 128-core server racks with multiple high-end GPUs running on factory floors and oil rigs."
        }
      ],
      trade: {
        buys: [
          "Ultra-low deterministic latency: delivers sub-10ms response times essential for robotics, autonomous vehicles, and industrial safety.",
          "Massive bandwidth cost savings: processes high-throughput video and sensor streams locally, transmitting only anomalies to the cloud.",
          "Offline operational autonomy: facilities continue manufacturing, processing payments, and operating even during total internet blackouts.",
          "Enhanced privacy and compliance: keeps sensitive video footage, medical telemetry, and customer PII on-premises within local firewalls."
        ],
        costs: [
          "Distributed fleet management overhead: orchestrating, securing, and debugging software across 10,000 edge nodes is complex.",
          "Hardware capital expenditure: purchasing and maintaining physical ruggedized edge servers across remote facilities.",
          "Physical security vulnerabilities: edge hardware is physically accessible to bad actors, requiring secure enclaves and tamper-proofing.",
          "Heterogeneous hardware environments: managing software compatibility across diverse architectures (ARM64, x86_64, custom NPUs)."
        ],
        avoid: [
          "Sending high-frequency raw video streams over cellular connections to the cloud instead of running local inference.",
          "Designing edge software that crashes or halts operations when WAN internet connectivity drops.",
          "Deploying edge devices without hardware Root of Trust (TPM) and cryptographically signed application containers.",
          "Treating edge nodes as disposable without automated remote provisioning, telemetry, and rollback capabilities."
        ]
      }
    },
    {
      slug: "embedded-systems",
      why: {
        before: "Machines and appliances were controlled entirely by electro-mechanical relays, gears, vacuum tubes, and analog electronic circuits that were bulky, inflexible, and unprogrammable.",
        problem: "Modifying machine behavior required physically rewiring hardware circuits; timing controls drifted with temperature and component aging; and complex mathematical computations were impossible.",
        shift: "Embedded Systems combined specialized microprocessors, dedicated firmware, and real-time operating systems into self-contained physical devices engineered to perform dedicated real-time control functions."
      },
      num: {
        t: "Embedded Systems Classification & Real-Time Constraints",
        h: ["Embedded System Class", "Real-Time Determinism Requirement", "Typical Operating System", "Memory & Hardware Footprint", "Typical Application Domain"],
        r: [
          ["Hard Real-Time Embedded", "Deadline miss = catastrophic system failure", "FreeRTOS, Zephyr, VxWorks, Integrity", "Kilobytes to low megabytes RAM; bare-metal / RTOS", "Automotive engine control (ECU), pacemaker, flight avionics, airbag triggers"],
          ["Soft Real-Time Embedded", "Deadline miss = degraded quality of service", "Embedded Linux, QNX, FreeRTOS", "Megabytes to gigabytes RAM; ARM Cortex-A", "Video streaming set-top boxes, digital cameras, audio synthesizers"],
          ["Firm Real-Time Embedded", "Infrequent deadline miss tolerated; result discarded", "RTOS / Real-Time Linux (PREEMPT_RT)", "Tens of megabytes RAM", "Industrial manufacturing assembly line sorting, telecommunication switches"],
          ["Bare-Metal / No OS", "Deterministic hardware interrupt cycle counting", "No OS; cyclic executive super-loop + ISRs", "Bytes to kilobytes RAM; 8-bit / 32-bit MCU (AVR, PIC, Cortex-M0)", "Electric toothbrush, microwave oven controller, simple temperature logger"]
        ],
        n: "An embedded system is a microprocessor-based system designed to execute a specific, dedicated task—often under rigorous real-time, electrical power, physical size, and environmental constraints. Unlike general-purpose computers (PCs, smartphones) where operating systems prioritize throughput and multi-tasking fairness, hard real-time embedded systems prioritize determinism: a computation must produce the correct result within a mathematically guaranteed time boundary. Missing a hard real-time deadline (such as failing to trigger an automotive airbag within 15 milliseconds of accelerometer deceleration) is classified as a total system failure. Consequently, embedded software utilizes Real-Time Operating Systems (RTOS) with priority-based pre-emptive schedulers, deterministic interrupt service routines (ISRs), and strictly forbids non-deterministic behaviors like dynamic heap allocation (`malloc`/`free`) during runtime."
      },
      miss: [
        {
          w: "Embedded programming is just standard software engineering written in C instead of Python or JavaScript.",
          r: "Embedded engineering requires deep hardware literacy: memory-mapped registers, bus protocols (I2C, SPI, CAN), direct memory access (DMA), timer prescalers, and oscilloscope hardware debugging."
        },
        {
          w: "A faster general-purpose CPU is always better for an embedded real-time system than a slower microcontroller.",
          r: "Fast general-purpose CPUs introduce non-deterministic execution due to complex caches, branch predictors, and power throttling; deterministic real-time controllers prize predictable instruction timing over raw clock gigahertz."
        },
        {
          w: "Dynamic memory allocation (`malloc()` / `free()`) is standard practice in safety-critical embedded systems.",
          r: "Dynamic heap allocation is strictly banned in safety-critical standards (MISRA C, DO-178C) because heap fragmentation leads to unpredictable runtime allocation failures and memory leaks."
        },
        {
          w: "Embedded systems always run Linux.",
          r: "Most embedded systems operate on bare-metal superloops or lightweight RTOS kernels (FreeRTOS) with less than 64 KB of RAM, where Linux cannot physically fit."
        }
      ],
      trade: {
        buys: [
          "Guaranteed real-time determinism: executes critical safety operations within microsecond deadlines without operating system jitter.",
          "Minimal power consumption: runs for years on tiny batteries or energy-harvesting circuits using deep-sleep power states.",
          "Low unit production cost: highly optimized bill of materials (BOM) allows mass production of hardware for fractions of a dollar.",
          "Extreme hardware reliability: solid-state design with zero moving parts and watchdog timers runs uninterrupted for decades."
        ],
        costs: [
          "Severely constrained resources: working within strict 16 KB RAM and 64 KB flash storage constraints requires tight code optimization.",
          "Arduous debugging: diagnosing faults requires hardware probes, JTAG debuggers, logic analyzers, and oscilloscopes.",
          "Rigid update paths: flashing updated firmware in the field requires specialized bootloaders and risks bricking physical devices.",
          "Long development lifecycles: hardware design, PCB fabrication, and regulatory safety certifications take months to years."
        ],
        avoid: [
          "Calling `malloc()` or `free()` inside continuous embedded execution loops or interrupt handlers.",
          "Performing slow operations (like printing debug strings over UART or waiting for I/O) inside Interrupt Service Routines (ISRs).",
          "Forgetting to enable the hardware Watchdog Timer (WDT) to automatically reset the microcontroller if software hangs.",
          "Failing to declare hardware-mutated register variables with the `volatile` keyword, allowing compiler optimization to break logic."
        ]
      }
    },
    {
      slug: "firmware",
      why: {
        before: "Early computer hardware logic was hardwired permanently into fixed electronic circuits; fixing a logic bug or altering hardware behavior required physically swapping integrated circuit chips or rewiring breadboards.",
        problem: "Hardware modifications were economically devastating for manufacturers; once devices were sold, any functional bug or protocol update was permanent and unpatchable.",
        shift: "Firmware established a hybrid layer of software written directly into non-volatile read-only memory (ROM, EEPROM, Flash) on hardware chips, providing the permanent, low-level operational instructions that control hardware components."
      },
      num: {
        t: "Firmware Architecture Tiers & Non-Volatile Memory Types",
        h: ["Firmware Layer / Memory Type", "Physical Storage Medium", "Execution Model", "Update Frequency / Mechanism", "Primary Hardware Role"],
        r: [
          ["Mask ROM / Boot ROM (ROM Code)", "Silicon Mask ROM baked during chip manufacturing", "Executes directly from ROM at CPU power-on reset vector", "Immutable; zero updates possible in the field", "Initializes clocks, enforces secure boot cryptographic validation"],
          ["Secondary Bootloader (SPL / U-Boot)", "Internal / External SPI NOR Flash", "Loads into internal SRAM; initializes external DRAM controllers", "Occasional OTA firmware flashing with dual-bank recovery", "Loads main operating system kernel or application firmware binary"],
          ["Application Firmware / RTOS Binary", "Internal High-Density Flash Memory", "Execute-in-Place (XIP) from Flash or copied to RAM", "Regular field updates via Over-The-Air (OTA) or JTAG/SWD", "Executes main device control algorithms, networking, and sensor reads"],
          ["BIOS / UEFI Firmware", "SPI Flash on motherboard", "Complex modular execution (SEC, PEI, DXE, BDS phases)", "Infrequent motherboard flashing via vendor utility", "Discovers PC hardware, configures ACPI tables, boots general-purpose OS"]
        ],
        n: "Firmware occupies the foundational boundary between physical electronics and abstract application software. Upon electrical power-on or hardware reset, the processor core begins execution at a hardcoded memory address known as the Reset Vector (e.g. `0x00000000` in ARM Cortex-M), which points directly into Boot ROM firmware. The firmware initializes phase-locked loops (PLLs) to establish system clocks, powers up memory controllers, configures GPIO pin multiplexing, and sets up vector interrupt tables. Modern secure firmware employs a Hardware Root of Trust (RoT) with Cryptographic Secure Boot: the Boot ROM verifies an asymmetric digital signature (RSA/ECDSA) embedded in the application firmware binary against a public key burned into one-time programmable (OTP) hardware fuses. If the signature is invalid, execution halts, permanently blocking unauthorized malicious firmware modifications."
      },
      miss: [
        {
          w: "Firmware and software are completely identical, interchangeable terms.",
          r: "Software runs on top of an operating system and can be easily deleted or reinstalled; firmware directly manages hardware registers, sits in non-volatile chip flash, and provides the baseline interface for the hardware to operate."
        },
        {
          w: "Firmware updates are completely risk-free and can be treated like updating a mobile phone app.",
          r: "A power failure or corruption during firmware flashing can permanently destroy the device's ability to boot ('bricking'), requiring dual-bank A/B bootloaders to ensure atomic rollbacks."
        },
        {
          w: "Firmware is permanently fixed in factory silicon and can never be updated once manufactured.",
          r: "Modern devices utilize flash memory (NOR/NAND), allowing firmware to be securely updated in the field via Over-The-Air (OTA) mechanisms or external programming headers."
        },
        {
          w: "Firmware code is always simple, tiny, and written entirely in pure assembly language.",
          r: "Modern UEFI firmware and automotive ECU firmware can span millions of lines of sophisticated C, C++, and Rust code, incorporating complex network stacks and cryptographic engines."
        }
      ],
      trade: {
        buys: [
          "Direct hardware control: executes with bare-metal speed, manipulating physical registers without OS virtualization overhead.",
          "Permanent operational readiness: stored in non-volatile memory; powers on instantly without loading external disks.",
          "Hardware extensibility: enables manufacturers to patch security flaws and add new hardware features post-sale via updates.",
          "Cryptographic Root of Trust: enforces Secure Boot to ensure only authenticated, untampered code executes on the device."
        ],
        costs: [
          "Bricking catastrophe risk: an interrupted flash write or corrupt binary can render physical hardware permanently unusable.",
          "Flash memory write cycle limits: non-volatile NOR/NAND flash wears out after 10,000 to 100,000 write cycles.",
          "Tooling complexity: flashing and debugging firmware requires dedicated hardware programmers (JTAG, ST-Link, Segger J-Link).",
          "Rigid memory footprint constraints: firmware binaries must fit within fixed microchip flash boundaries (often < 512 KB)."
        ],
        avoid: [
          "Implementing single-bank firmware updates without a fail-safe dual-bank (A/B) rollback bootloader.",
          "Deploying firmware without cryptographic signature validation, allowing malicious hackers to flash custom malicious binaries.",
          "Writing frequently mutated configuration data directly to the same flash sectors as the bootloader, risking memory wear.",
          "Ignoring hardware watchdog timers during lengthy firmware flashing routines, causing accidental watchdog resets."
        ]
      }
    },
    {
      slug: "microcontroller",
      why: {
        before: "Computer systems required separate, discrete motherboard components: a central CPU chip, external RAM memory chips, external ROM storage chips, and multiple independent input/output peripheral controller chips.",
        problem: "Multi-chip systems were physically bulky, power-hungry, expensive, and fragile, making it impossible to add intelligent computing into compact consumer products, power tools, or automotive sensors.",
        shift: "The Microcontroller (MCU) integrated the CPU core, RAM, non-volatile flash memory, and diverse I/O peripherals (timers, ADCs, UART, SPI, I2C, PWM) onto a single monolithic silicon integrated circuit."
      },
      num: {
        t: "Microcontroller Architectures & Silicon Generations",
        h: ["MCU Architecture / Family", "Bus Width & Clock Speed", "Typical RAM / Flash Footprint", "Active Power Consumption", "Primary Application Domain"],
        r: [
          ["8-bit (e.g. Microchip PIC / AVR ATmega328P)", "8-bit @ 8 - 20 MHz", "2 KB RAM / 32 KB Flash", "10 - 20 mW (milliwatts)", "Arduino, simple appliances, toys, power tool triggers, sensor nodes"],
          ["16-bit (e.g. TI MSP430)", "16-bit @ 16 - 25 MHz", "4 - 16 KB RAM / 32 - 128 KB Flash", "Ultra-low (< 1 mW; nanoamps in sleep)", "Battery-powered medical meters, smart water/gas metering, environmental loggers"],
          ["32-bit ARM Cortex-M0+ / M3 / M4", "32-bit @ 48 - 168 MHz (with FPU/DSP on M4)", "32 - 256 KB RAM / 256 KB - 1 MB Flash", "20 - 100 mW", "Industrial PLCs, drones, smart appliances, automotive dashboards, motor control"],
          ["32-bit Wireless SoC (e.g. ESP32)", "32-bit Dual-Core Xtensa/RISC-V @ 240 MHz", "520 KB RAM / 4 - 16 MB External Flash", "150 - 500 mW (Wi-Fi TX active)", "Connected IoT devices, smart home automation, Wi-Fi/BLE sensor gateways"],
          ["32-bit Safety-Critical (ARM Cortex-R / TriCore)", "32-bit Dual-Core Lockstep @ 300+ MHz", "Megabytes RAM with ECC memory", "1 - 3 W", "Automotive ABS braking, steer-by-wire, engine management, industrial robotics"]
        ],
        n: "A microcontroller unit (MCU) is a self-contained computer-on-a-chip. Unlike a microprocessor (MPU, such as an Intel Core or AMD Ryzen) which focuses purely on computational CPU throughput and requires external RAM, storage, and chipset controllers, an MCU is optimized for embedded control. The silicon die integrates a CPU core with volatile Static RAM (SRAM, requiring zero refresh cycles), non-volatile Flash memory, and a rich array of hardware peripherals accessed via memory-mapped input/output (MMIO). These peripherals include Analog-to-Digital Converters (ADCs) to read real-world voltage signals, Pulse-Width Modulation (PWM) channels to drive motors, and hardware communication controllers (UART, SPI, I2C, CAN bus). MCUs operate at low clock frequencies (megahertz rather than gigahertz) and consume minimal electrical current, enabling them to sleep in microamp low-power states until woken by an external hardware interrupt."
      },
      miss: [
        {
          w: "A microcontroller and a microprocessor are the exact same thing.",
          r: "A microprocessor (MPU) contains only CPU cores and requires external RAM, storage, and controllers; a microcontroller (MCU) integrates CPU, RAM, flash memory, and hardware peripherals onto a single silicon chip."
        },
        {
          w: "Microcontrollers are too weak and primitive to be used in modern high-tech engineering.",
          r: "Modern automobiles contain over 100 microcontrollers managing everything from fuel injection to airbag sensors; billions of MCUs power industrial robotics, medical devices, and aerospace systems."
        },
        {
          w: "You must run Linux on a microcontroller to build an Internet of Things product.",
          r: "Standard MCUs lack the memory management unit (MMU) and multi-megabyte RAM required to run full Linux; they run bare-metal C/C++/Rust code or lightweight RTOS kernels like FreeRTOS or Zephyr."
        },
        {
          w: "Reading a sensor on a microcontroller requires a continuous while-loop polling the pin forever.",
          r: "Continuous software polling wastes immense battery power and CPU cycles; efficient MCU engineering configures hardware interrupts or Direct Memory Access (DMA) to notify the CPU only when data is ready."
        }
      ],
      trade: {
        buys: [
          "Self-contained computing: requires zero external memory chips or support chipsets, drastically shrinking PCB footprint.",
          "Ultra-low electrical power: runs for years on coin-cell batteries by entering deep sleep states consuming less than 1 microamp.",
          "Deterministic hardware response: hardware interrupt controllers handle external electrical events within nanoseconds.",
          "Low unit bill of materials (BOM): commodity 8-bit and 32-bit microcontrollers cost between $0.20 and $2.00 in production volumes."
        ],
        costs: [
          "Severe memory constraints: applications must strictly fit within kilobytes of RAM and flash memory.",
          "Lack of virtual memory: absence of a Memory Management Unit (MMU) means no memory protection between tasks; wild pointers crash the chip.",
          "Lower compute performance: slow clock speeds (megahertz) make heavy floating-point operations or deep learning inference slow.",
          "Rigid peripheral limitations: limited number of hardware timers, ADC channels, and serial pins available on the physical chip package."
        ],
        avoid: [
          "Continuously polling GPIO pins in a tight `while(1)` loop instead of configuring low-power sleep modes and hardware interrupts.",
          "Selecting a high-end microprocessor running Linux for a simple sensor reading task that a $0.50 microcontroller can handle.",
          "Failing to filter analog ADC input pins with decoupling capacitors, resulting in noisy, erratic sensor readings.",
          "Allocating large arrays on the call stack inside functions, causing silent stack-overflow memory corruption into the global data segment."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
