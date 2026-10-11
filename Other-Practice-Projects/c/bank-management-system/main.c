#include <stdio.h>
#include <string.h>

// macros
#define MAX 100

// Function to log in to an account

//Structure to store bank account information

	typedef struct Accounts {
		int acc_no;        // Account number
		char name[MAX];            // Account holder's name
		char password[20];        // Account password
		float balance;            // Account balance
	} Account;



int login(Account accs[], int n) {
	int acc_no;
	char password[20];
	printf("\n=== Login to your account ===\n");
	printf("Enter Account Number: ");
	scanf("%d", &acc_no);
	printf("Enter Password: ");
	scanf("%s", password);

	for (int i = 0; i < n; i++) {  // iterating through comments to check if account and password match
		if (accs[i].acc_no == acc_no && strcmp(accs[i].password, password) == 0) { // strcmp- compares the strings
			printf("Login successful!\n");
			return i;
		}
	}
	printf("Invalid account number or password. Login failed!\n");
	return -1;
}

// Function to withdraw money
void withdraw(Account *acc) {
	float amm;
	printf("\n=== Withdraw Money ===\n");
	printf("Enter amm to withdraw: ");
	scanf("%f", &amm);

	if (amm > 0 && amm <= acc->balance) {
		acc->balance -= amm;
		printf("Withdrawal successful! New balance: %.2f\n", acc->balance);
	} else {
		printf("Invalid amm or insufficient balance!\n");
	}
}

// Function to deposit money
void deposit(Account *acc) {
	float amm;
	printf("\n=== Deposit Money ===\n");
	printf("Enter amm to deposit: ");
	scanf("%f", &amm);

	if (amm > 0) {
		acc->balance += amm;
		printf("Deposit successful! New balance: %.2f\n", acc->balance); // acc->balance = *acc= balance
	} else {
		printf("Invalid amm!\n");
	}
}

// Function to transfer money
void transfer(Account accs[], int totalAccounts, Account *acc1) {
	int acc2_no;
	float amm;
	printf("\n=== Transfer Money ===\n");
	printf("Enter receiver's account number: ");
	scanf("%d", &acc2_no);
	printf("Enter amm to transfer: ");
	scanf("%f", &amm);

	if (amm <= 0 || amm > acc1->balance) {
		printf("Invalid amm or insufficient balance!\n");
		return;
	}

	// Find the receiver's account
	for (int i = 0; i < totalAccounts; i++) {
		if (accs[i].acc_no == acc2_no) {
			acc1->balance -= amm;
			accs[i].balance += amm;
			printf("Transfer successful! Your new balance: %.2f\n", acc1->balance);
			printf("Receiver's new balance: %.2f\n", accs[i].balance);
			return;
		}
	}
	printf("Receiver account not found. Transfer failed!\n");
}

// Function to display account details
void acc_details(Account acc) {
	printf("\n=== Account Details ===\n");
	printf("Account Number: %d\n", acc.acc_no);
	printf("Name: %s\n", acc.name);
	printf("Balance: %.2f\n", acc.balance);
}

int main(void) {

	// Array of structures- accounts
	Account accs[] = {   //account data type(from typedef)- accs-array(of structures) name
		{101, "Alice", "alice123", 5000.0f},
		{102, "Bob", "bob123", 3000.0f},
		{103, "Charlie", "charlie123", 7000.0f}
	};

	int n = sizeof(accs) / sizeof(accs[0]); // Number of accounts that exist- to iterate through to match the password and the username

	while (1) {  // while(1)  helps in running the loop infinitely until exited

		printf("\n=== Bank of SNU ===\n");

exit:
		printf("1. Login to Account\n");
		printf("2. Exit\n");
		printf("Enter your choice: ");

		int x;
		scanf("%d", &x);

		if (x == 1) {
			int n2 = login(accs, n);  // running the function to login to account
			if (n2 != -1) {
				Account *acc1 = &accs[n2]; // Account data type- pointer acc1 stores value of nth account in accs array(i.e. the array of structures)
				while (1) {
					printf("\n=== Account Menu ===\n");
					printf("1. Withdraw Money\n");
					printf("2. Deposit Money\n");
					printf("3. Transfer Money\n");
					printf("4. Display Account Details\n");
					printf("5. Logout\n");
					printf("Enter your choice: ");
					int y;
					scanf("%d", &y);

					switch (y) {
					case 1:
						withdraw(acc1);
						break;
					case 2:
						deposit(acc1);
						break;
					case 3:
						transfer(accs, n, acc1);
						break;
					case 4:
						acc_details(*acc1);
						break;
					case 5:
						printf("Logged out successfully.\n");
						goto exit;
						break;
					default:
						printf("Invalid choice! Please try again.\n");
					}
				}
			}
		} else if (x == 2) {
			printf("Exiting the program. Goodbye!\n");
			break;
		} else {
			printf("Invalid choice! Please try again.\n");
		}
	}
	return 0;
}
