def start_view():

    print("Welcome to Hangman game!")
    HANGMAN_ASCII_ART = r"""
    _    _
    | |  | |
    | |__| | __ _ _ __   __ _ _ __ ___   __ _ _ __
    |  __  |/ _` | '_ \ / _` | '_ ` _ \ / _` | '_ \
    | |  | | (_| | | | | (_| | | | | | | (_| | | | |
    |_|  |_|\__,_|_| |_|\__, |_| |_| |_|\__,_|_| |_|
                        __/ |
                        |___/"""
    print(HANGMAN_ASCII_ART)


def show_hidden_word(secret_word, old_letters_guessed):
    paint_list = ["_ "] * len(secret_word)
    for i in range(len(secret_word)):
        if secret_word[i] in old_letters_guessed:
            paint_list[i] = secret_word[i] + " "
    return "".join(paint_list)


def is_valid_input(guess_letter, old_letters_guessed=[]):

    if len(guess_letter) != 1:
        print("E1: please guess a single letter.")
        return False
    if not guess_letter.isalpha():
        print("E2: please guess a valid letter.")
        return False
    if guess_letter in old_letters_guessed:
        print("E3: you already guessed this letter.")
        return False

    old_letters_guessed.append(guess_letter)
    return True


def drawer_tries_left(tries):

    HANGMAN_PHOTOS = {
        1: r"""status of hangman:
          x-------x
        """
        + "\n \n",
        2: r"""status of hangman:
          x-------x
          |
          |
          |
          |
          |"""
        + "\n",
        3: r"""status of hangman:

          x-------x
          |       |
          |       0
          |
          |
          |
        """
        + "\n",
        4: r"""status of hangman:

          x-------x
          |       |
          |       0
          |       |
          |
          |
        """
        + "\n",
        5: r"""status of hangman:

          x-------x
          |       |
          |       0
          |      /|\
          |
          |
        """
        + "\n",
        6: r"""status of hangman:
                x-------x
                |       |
                |       0
                |      /|\
                |      /
                |
        """
        + "\n",
        7: r"""status of hangman:
                x-------x
                |       |
                |       0
                |      /|\
                |      / \
                |
        """
        + "\n",
    }
    if tries == 0:
        print(HANGMAN_PHOTOS[1])
    elif tries == 1:
        print(HANGMAN_PHOTOS[2])
    elif tries == 2:
        print(HANGMAN_PHOTOS[3])
    elif tries == 3:
        print(HANGMAN_PHOTOS[4])
    elif tries == 4:
        print(HANGMAN_PHOTOS[5])
    elif tries == 5:
        print(HANGMAN_PHOTOS[6])
    elif tries == 6:
        print(HANGMAN_PHOTOS[7])


def check_win(secret_word, old_letters_guessed):
    if "_" not in show_hidden_word(secret_word, old_letters_guessed):
        print("champion! you guessed the word:", secret_word)
        return True
    return False


def choose_word(file_path, index):
    unique_words = set()
    with open(file_path, "r") as file:
        index_word = []
        for line in file:
            words = line.split()
            index_word.extend(words)
            for word in words:
                unique_words.add(word)
        carousel_index = int(index) % len(index_word)
        return len(unique_words), index_word[carousel_index]


def main():
    start_view()
    tries = 0
    MAX_TRIES = 6
    old_letters_guessed = []
    file_path = input("Enter file path: ")  # C:/Users/user-1/Downloads/words.txt
    index = input("Enter index: ")
    unique_words_len, secret_word = choose_word(file_path, index)
    while tries < MAX_TRIES:
        drawer_tries_left(tries)
        print(
            "The guess is: " + show_hidden_word(secret_word, old_letters_guessed) + "\n"
        )
        guess_letter = input("guess a letter: ").lower()
        if not is_valid_input(guess_letter, old_letters_guessed):
            print("X")
            print("guessed word: ", ", ".join(old_letters_guessed))
            continue
        if guess_letter in secret_word:
            print(f"good guess! '{guess_letter}' is in the word.")
        else:
            tries += 1
            print(f"the guess is wrong! You have {MAX_TRIES - tries} tries left.")
            drawer_tries_left(tries)
        if check_win(secret_word, old_letters_guessed):
            break

    if tries == MAX_TRIES:
        print(
            f"\nGame over! you used all the guessed. The secret word was: {secret_word}"
        )


if __name__ == "__main__":
    main()
