// Create a program that lists every 3rd number between 1-20 and prints it to the console.

for (i = 1; i <= 20; i++) {
    if ((i - 1) % 3 == 0) {
        console.log(i)
    }
}