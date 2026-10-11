"""A small interactive dice roller."""
import random

while True:
    choice = input("Roll the dice? (y/n): ").strip().lower()
    if choice == "n":
        print("Thanks for playing!")
        break
    if choice != "y":
        print("Please enter y or n.")
        continue
    while True:
        try:
            count = int(input("Number of dice: "))
            if count > 0:
                break
        except ValueError:
            pass
        print("Please enter a positive whole number.")
    print(f"You rolled: {[random.randint(1, 6) for _ in range(count)]}")
