#include <stdio.h>

int main() {
  int num1, num2, num3, num4, sum;

  printf("Enter four integers separated by spaces: ");
  scanf("%d %d %d %d", &num1, &num2, &num3, &num4);

  sum = num1 + num2 + num3 + num4;

  printf("The sum of %d, %d, %d, and %d is: %d\n", num1, num2, num3, num4, sum);

  return 0;
}

