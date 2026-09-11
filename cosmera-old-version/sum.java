import java.util.Scanner;

public class sum {
    public static void main(String[] args) {
        // Create a Scanner object to read input from the user
        Scanner input = new Scanner(System.in);

        // Prompt the user for the first number
        System.out.print("Enter the first float number: ");
        float num1 = input.nextFloat();

        // Prompt the user for the second number
        System.out.print("Enter the second float number: ");
        float num2 = input.nextFloat();

        // Calculate the sum
        float sum = num1 + num2;

        // Print the result, formatted to two decimal places
        System.out.printf("The sum of %.2f and %.2f is: %.2f\n", num1, num2, sum);

        // Close the scanner to prevent resource leaks
        input.close();
    }
}

