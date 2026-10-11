import random
import sys

# define the simulation function
def run_monty_hall_simulation():

    print("------ Monty Hall Simulation ------")

    # taking user inputs and exception handling
    while True:
        try:
            N= int(input("Enter number of simulations to run (N): "))
            
            if N <= 0:
                raise ValueError("Number of simulations must be greater than 0.")

            player_choice = int(input("Select a door (0, 1, or 2): "))
            
            if player_choice not in [0, 1, 2]:
                raise ValueError("Door must be 0, 1, or 2.")
            
            break

        except ValueError as e:
            print(f"Error: {e}. Please try again.")

    # setup
    theoretical_rate = 2/3
    doors = [0, 1, 2]
    wins_stay = 0
    wins_switch = 0
    
    # Main simulation
    for i in range(N):
        # Randomly assign prize to one of the doors
        prize_door = random.choice(doors)
        
        # identify doors available for the host to open and chose one randomly
        available_for_host = [d for d in doors if d != player_choice and d != prize_door]
        host_opens = random.choice(available_for_host)
        
        # Identify the door that the player can switch to
        switch_choice = [d for d in doors if d != player_choice and d != host_opens][0]
        
        # Result of one simulation
        # If player decides to keep the choice
        if player_choice == prize_door:
            wins_stay += 1
            
        # If player decides to Switch the choice
        if switch_choice == prize_door:
            wins_switch += 1

        if i % 1000 == 0: progress_bar(i, N)

    # Final probabilities
    prob_stay = wins_stay / N
    prob_switch = wins_switch / N

    error_rate = abs(prob_switch - theoretical_rate) * 100

    # Display results
    print(f"""
        {'='*30}
        SIMULATION RESULTS FOR (N={N} SIMULATIONS)
        {'='*30}
        Player Choice: Door {player_choice}
        {'='*30}
        Host opens: Door {host_opens}
        Prize door: Door {prize_door}
        {'-'*30}
        Strategy: KEEP   | Wins: {wins_stay:<5} | {wins_stay/N:.2%}
        Strategy: SWITCH | Wins: {wins_switch:<5} | {wins_switch/N:.2%}
        {'-'*30}
        Theoretical Win Rate (Switch): {theoretical_rate:.2%}
        Actual Win Rate (Switch):      {prob_switch:.2%}
        ERROR RATE (Difference):       {error_rate:.4f}%        
        {'='*30}
    """)
    
    # Conclusion
    if prob_switch > prob_stay:
        print("CONCLUSION: Switching is better.")
    else:
        print("CONCLUSION: Keeping the choice is better.")

# progress bar function
def progress_bar(current, total, bar_length=20):
    percent = float(current) * 100 / total
    arrow = '-' * int(percent/100 * bar_length - 1) + '>'
    spaces = ' ' * (bar_length - len(arrow))
    
    sys.stdout.write(f"\rProgress: [{arrow+spaces}] {percent:.2f}%")
    sys.stdout.flush()

# Run the function
if __name__ == "__main__":
    run_monty_hall_simulation()