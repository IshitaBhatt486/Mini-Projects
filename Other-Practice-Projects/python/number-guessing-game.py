# number guessing game
# the computer generates a random number and the user tries to guess it
# the user is given hints (if the answer is higher or lower than the guessed number)

import random

answer= random.randint(1,100)

while True:
    
    try:
        user_guess= int(input('guess the number- (Hint: The number is between 1 and 100)'))

        if user_guess<answer:
            print('Too Low!')
        elif user_guess>answer:
            print('Too High!')
        else :
            print('Congratulations! You guessed the number')
            break

    except ValueError:
        print('Please enter a valid value(integer)')