# Mini Projects

Small independent projects, organized by runtime.

- `web/` — open a project's `index.html` in a browser.
- `python/` — run a script with `python <script-name>.py`. Install optional dependencies with `python -m pip install -r python/requirements.txt`.
- `c/` — compile each `main.c` with a C11 compiler, for example `gcc -std=c11 -Wall -Wextra main.c -o app`.

## Web projects

| Project | Description |
| --- | --- |
| `calculator` | Four-function calculator interface. |
| `compound-interest-calculator` | Calculates compound interest from a principal, rate, and duration. |
| `counter` | Increment, decrement, and reset a displayed counter. |
| `digital-clock` | Full-screen live 12-hour digital clock. |
| `image-toggle` | Shows and hides a bundled car illustration. |
| `interactive-box` | Interactive box that changes its message and color on hover or click. |
| `loading-animations/3d-loader` | Rotating 3D-style square loading animation. |
| `loading-animations/ellipses` | Animated row of glowing loading dots. |
| `loading-animations/flip-fold` | Sequential folding-square loading animation. |
| `loading-animations/four-squares` | Four-square pulsing loading animation. |
| `loading-animations/newtons-cradle` | CSS Newton's-cradle animation. |
| `number-guessing-game` | Browser prompt-based game for guessing a number from 1–100. |
| `password-generator` | Configurable browser password generator using cryptographic randomness. |
| `random-number-generator` | Rolls and displays a random die value. |
| `rock-paper-scissors` | Play rock-paper-scissors against the computer with score tracking. |
| `stopwatch` | Start, stop, and reset a millisecond stopwatch. |
| `temperature-converter` | Converts a temperature between Fahrenheit and Celsius. |
| `tic-tac-toe` | Two-player tic-tac-toe game with turn and winner feedback. |
| `tic-tac-toe-classic` | A second, self-contained classic tic-tac-toe implementation. |
| `todo-list` | Add and delete tasks in a simple to-do list. |
| `weather-app` | Fetches and displays current weather for a city using OpenWeather. |

## Python projects

| Script | Description |
| --- | --- |
| `bulk-file-renamer.py` | Renames files in a chosen folder using a shared numbered prefix. |
| `daily-spending-tracker.py` | Validates and appends an expense entry to `expenses.csv`. |
| `dice-roll.py` | Interactive multi-die roller. |
| `draw-canvas.py` | Pygame canvas that lets a rectangle move with WASD keys. |
| `moving-rectangle.py` | Pygame rectangle movement demo controlled with WASD keys. |
| `number-guessing-game.py` | Terminal number-guessing game with high/low hints. |
| `password-generator.py` | Generates a strong password and copies it to the clipboard. |
| `qr-code-generator.py` | Creates a PNG QR code from entered text or a URL. |
| `rock-paper-scissors.py` | Terminal rock-paper-scissors game with score tracking. |

## C projects

| Project | Description |
| --- | --- |
| `bank-management-system` | Menu-driven demo bank system with login, deposits, withdrawals, transfers, and balances. |
| `rock-paper-scissors` | Command-line rock-paper-scissors game against a random computer choice. |

## Configuration

To use the weather app, add a personal OpenWeather API key to `web/weather-app/index.js`