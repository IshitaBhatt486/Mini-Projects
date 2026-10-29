# PLC
A Siemens SIMATIC S7-300 (CPU 314C-2 PN/DP) was used in Siemens TIA Portal V11. Ladder logic is used to implement basic logic gates, a timer, and a motor start-stop latching circuit.

## Hardware and Software
- Siemens SIMATIC S7-300 PLC (CPU 314C-2 PN/DP)
- Siemens TIA Portal V11
- PC/laptop and PLC communication cable
- Push buttons/switches, output indicator or motor
- PLC power supply and connecting wires

## Experiments

### 1. Logic Gates
Implemented OR, AND, NAND, NOR, and XOR gates using PLC input addresses `I136.x` and output addresses `Q136.x`.

| Gate | Boolean Expression | Output HIGH When |
|---|---|---|
| OR | `Y = A + B` | At least one input is HIGH |
| AND | `Y = A · B` | Both inputs are HIGH |
| NAND | `Y = NOT(A · B)` | At least one input is LOW |
| NOR | `Y = NOT(A + B)` | Both inputs are LOW |
| XOR | `Y = A ⊕ B` | Inputs differ |

### 2. Timer Circuit
A TON (on-delay) timer was configured. When its input becomes HIGH, it starts counting. The timer output becomes HIGH after the preset time has elapsed.

### 3. Motor Start-Stop Latch
A latching circuit was implemented using a holding contact in parallel with the START input. The motor output remains ON after START is released. A normally closed STOP contact turns the output OFF and breaks the holding path.

## Procedure
1. Create a project in TIA Portal V11 and configure the S7-300 CPU.
2. Write the ladder logic in `Main [OB1]`.
3. Compile the program and check for errors.
4. Download the configuration and program to the PLC.
5. Enable online monitoring and test the input/output states.

## Result
The logic-gate outputs matched their truth tables. The TON timer delayed its output until the preset time elapsed, and the latching circuit held the motor output ON until STOP was pressed.

## Conclusion
The experiment demonstrates PLC programming, digital logic implementation, time-delay control, and motor holding logic used in industrial automation.