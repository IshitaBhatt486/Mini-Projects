import random

valid_choices = ('r', 'p', 's')

emojis = {
    'r': '🪨',
    'p': '📄',
    's': '✂️'
}

# functions
def get_user_choice():
    while True:
        user_choice = input('Choose Rock, Paper or Scissors (r/p/s): ').lower()
        if user_choice in valid_choices:
            return user_choice
        else:
            print('Invalid choice!\nPlease select a valid choice.')

def display_choices(user_choice, computer_choice):
    print(f'You chose {user_choice} {emojis[user_choice]}')
    print(f'Computer chose {computer_choice} {emojis[computer_choice]}')

def determine_winner(user_choice, computer_choice, player_score, computer_score):
    if user_choice == computer_choice:
        print("It's a tie!")
    elif (
        (user_choice == 'p' and computer_choice == 'r') or
        (user_choice == 'r' and computer_choice == 's') or
        (user_choice == 's' and computer_choice == 'p')
    ):
        print("You Win!")
        player_score += 1
    else:
        print("You Lose!")
        computer_score += 1
    return player_score, computer_score

def play_game():
    player_score = 0
    computer_score = 0
    play = True

    while play:
        user_choice = get_user_choice()
        computer_choice = random.choice(valid_choices)

        display_choices(user_choice, computer_choice)

        player_score, computer_score = determine_winner(
            user_choice, computer_choice, player_score, computer_score
        )

        print(f"Score: You: {player_score} | Computer: {computer_score}")

        while True:
            continue_game = input('Would you like to continue? (y/n): ').lower()
            if continue_game == 'y':
                break
            elif continue_game == 'n':
                print("Thanks for playing!")
                play = False
                break
            else:
                print('Invalid choice')

play_game()
