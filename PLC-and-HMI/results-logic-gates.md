# Observations: PLC Fundamentals

## 1. OR Gate

| Input A | Input B | Output Y |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

Observation: The output is HIGH when at least one input is HIGH.

## 2. AND Gate

| Input A | Input B | Output Y |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

Observation: The output is HIGH only when both inputs are HIGH.

## 3. NAND Gate

| Input A | Input B | Output Y |
|---:|---:|---:|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Observation: The output is LOW only when both inputs are HIGH.

## 4. NOR Gate

| Input A | Input B | Output Y |
|---:|---:|---:|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

Observation: The output is HIGH only when both inputs are LOW.

## 5. XOR Gate

| Input A | Input B | Output Y |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Observation: The output is HIGH when the two inputs differ.

## 6. TON Timer

Observation: After the assigned push button was activated, the timer started counting. The output became HIGH when the elapsed time reached the preset time.

## 7. Motor Start-Stop Latch

| Action | Observation |
|---|---|
| Press START | Motor output turns ON |
| Release START | Motor output remains ON |
| Press STOP | Motor output turns OFF |
| After STOP | Output remains OFF until START is pressed again |

## Overall Observation
The observed outputs followed the expected truth tables and control behaviour of the logic gates, on-delay timer, and motor latching circuit.