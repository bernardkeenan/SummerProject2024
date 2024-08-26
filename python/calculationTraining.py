import random

# Array containing the big blind values
BB_array = [50, 100, 150, 200, 300, 400, 600, 1000, 1400, 2000, 3000, 4000, 6000, 10000]

# Function to randomly select a big blind value from the array
def select_random_BB(BB_array):
    return random.choice(BB_array)

BB = select_random_BB(BB_array) # selected BB value

UL =  50  # upper limit of number of big blinds in our case 50
Min_chip = 25 # minimum chip denomination

limit = BB * UL / Min_chip 

# Define the mean of the Poisson distribution
lambda_ = 20

# Generate a random number with Poisson distribution centered around lambda_
random_number = np.random.poisson(lambda_)

# Ensure the random number is within the specified limit
while random_number >= limit:
    random_number = np.random.poisson(lambda_)

Chip_stack = random_number * Min_chip;

No_BB = ((Chips_stack + BB - 1) // BB) # This is the the number of big blinds the player has
      
