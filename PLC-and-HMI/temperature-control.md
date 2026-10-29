# PLC Temperature Monitoring and Control

## Overview
This experiment uses a Siemens S7-314C-2 PN/DP PLC and a TP700 Comfort HMI to monitor and control water temperature using a PT100 RTD sensor.

The system uses on/off control with hysteresis, temperature display, a high-temperature alarm, and an automatic drain valve.

## Temperature Control Logic

| Temperature Condition | Expected Action |
|---|---|
| T ≤ 55 °C | Heater ON |
| T ≥ 58 °C | Heater OFF |
| T ≥ 60 °C | Hooter ON and drain valve OPEN |
| Manual reset | Silence hooter and close valve |

The hysteresis band between 55 °C and 58 °C prevents rapid switching of the heater. Thermal inertia may cause a small temperature overshoot after the heater switches OFF.

## PLC Inputs and Outputs

| Address | Function |
|---|---|
| `IW804` | Analog input carrying the conditioned PT100 signal |
| `MD200` | Scaled temperature value displayed on the HMI |
| `MD100` | HMI setpoint input, if used |
| `MD104` | HMI lower-limit input, if used |
| `I136.2` | Physical START push button |
| `I136.3` | Physical STOP push button |
| `Q136.5` | Heater |
| `Q136.4` | Hooter |
| `Q136.6` | Solenoid drain valve |
| `Q136.2` | Heating indicator lamp |
| `Q136.3` | Alarm indicator lamp |

## Temperature Signal Scaling

The PT100 signal-conditioning circuit converts the sensor measurement into a 4–20 mA signal representing 0–100 °C.

The PLC receives the raw analog value at `IW804`, with the documented mapping:

- 4 mA → raw value 0 → 0 °C
- 12 mA → raw value 13824 → 50 °C
- 20 mA → raw value 27648 → 100 °C

The temperature is calculated as:

`Temperature (°C) = IW804 / 27648 × 100`

The scaled REAL value is stored at `MD200` for HMI display.

## HMI Integration

The TP700 Comfort HMI communicates with the PLC over PROFINET. It displays the temperature, provides START and reset controls, and displays indicators for the heater, hooter, and valve.

## Expected Observations

| Event | Temperature | Heater | Hooter / Valve |
|---|---|---|---|
| Heating | ≤ 55 °C | ON | OFF |
| Heater cutoff | ≥ 58 °C | OFF | OFF |
| High-temperature alarm | ≥ 60 °C | OFF | ON |
| Manual reset | Any | OFF | OFF |

## Result
The ladder logic was designed for the S7-314C-2 PN/DP PLC. The documented objective was to display the temperature on the TP700 Comfort HMI, switch the heater at the specified thresholds, and activate the hooter and drain valve at the high-temperature alarm limit.

## Conclusion
The experiment demonstrates analog sensor interfacing, signal scaling, HMI communication, hysteresis-based temperature control, and alarm handling using a PLC.