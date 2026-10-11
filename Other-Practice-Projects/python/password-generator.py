import random
import string
import tkinter as tk # Built-in GUI library used here just for clipboard access

def generate_password(length=16):
    chars = string.ascii_letters + string.digits + string.punctuation
    # Ensure at least one lowercase, uppercase, digit, and special char
    password = [
        random.choice(string.ascii_lowercase),
        random.choice(string.ascii_uppercase),
        random.choice(string.digits),
        random.choice(string.punctuation)
    ]
    # Fill the rest of the length randomly
    password += [random.choice(chars) for _ in range(length - 4)]
    random.shuffle(password)
    
    final_password = "".join(password)
    
    # Copy to clipboard
    r = tk.Tk()
    r.withdraw()
    r.clipboard_clear()
    r.clipboard_append(final_password)
    r.update() # Keeps it in clipboard after script exits
    
    return final_password

print(f"Generated and copied to clipboard: {generate_password()}")