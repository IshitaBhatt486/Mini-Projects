#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int main(void)
{
    const char *options[] = {"Rock", "Paper", "Scissors"};
    char user[16];

    srand((unsigned int)time(NULL));
    printf("Hello!\nLet's play Rock, Paper, Scissors.\n");
    printf("Type Rock, Paper, or Scissors\nYour move: ");
    if (scanf("%15s", user) != 1) {
        printf("Could not read your move.\n");
        return 1;
    }

    int userMove = -1;
    for (int i = 0; i < 3; i++) {
        if (strcmp(user, options[i]) == 0) {
            userMove = i;
            break;
        }
    }
    if (userMove == -1) {
        printf("Invalid move. Please enter Rock, Paper, or Scissors.\n");
        return 1;
    }

    int computerMove = rand() % 3;
    printf("My move: %s\n", options[computerMove]);

    if (userMove == computerMove) {
        printf("%s vs %s: it's a tie!\n", options[userMove], options[computerMove]);
    } else if ((userMove - computerMove + 3) % 3 == 1) {
        printf("%s vs %s: You win! :)\n", options[userMove], options[computerMove]);
    } else {
        printf("%s vs %s: You lose! :( Better luck next time.\n",
               options[userMove], options[computerMove]);
    }
    return 0;
}

