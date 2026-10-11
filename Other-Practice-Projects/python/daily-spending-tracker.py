"""Append one validated expense to expenses.csv."""
import csv
from datetime import datetime
from pathlib import Path

def log_expense(amount: float, category: str, description: str, filename: Path = Path("expenses.csv")) -> None:
    new_file = not filename.exists()
    with filename.open("a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        if new_file: writer.writerow(["Date", "Amount", "Category", "Description"])
        writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M"), f"{amount:.2f}", category, description])

if __name__ == "__main__":
    while True:
        try:
            amount = float(input("Amount: "))
            if amount > 0: break
        except ValueError:
            pass
        print("Enter a positive number.")
    category = input("Category: ").strip() or "Uncategorized"
    description = input("Description: ").strip()
    log_expense(amount, category, description)
    print("Expense logged.")
