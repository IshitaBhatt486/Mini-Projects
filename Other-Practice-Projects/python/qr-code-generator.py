"""Generate a QR-code PNG from entered text or URL."""
from pathlib import Path
import qrcode

if __name__ == "__main__":
    data = input("Text or URL: ").strip()
    filename = input("Output filename [qrcode.png]: ").strip() or "qrcode.png"
    if not data:
        raise SystemExit("Text or URL cannot be empty.")
    path = Path(filename)
    if path.suffix.lower() != ".png": path = path.with_suffix(".png")
    qrcode.make(data).save(path)
    print(f"QR code saved to {path}")
