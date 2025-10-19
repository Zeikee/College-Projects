import BoggledGame.*;
import tables.User;

import javax.swing.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Timer;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class BoggledServant extends BoggledInterfacePOA {

    private static final ArrayList<String> words = getWords();
    private static final HashMap<Game, Integer> readyHashmap = new HashMap<>();
    private static final HashMap<Game, Integer> roundHashmap = new HashMap<>();
    private static final ArrayList<String> onlinePlayers = new ArrayList<>();
    private static final HashMap<Player, Integer> overallPlayerPoints = new HashMap<>();
    private static final ArrayList<Game> gameArrayList = new ArrayList<>();
    private static int timerCount;
    private static int anInt;
    private boolean GAME_WAITING = false;

    /**
     * This function reads a file called "words.txt" and returns its contents as an ArrayList of Strings.
     *
     * @return An ArrayList of Strings containing the words read from the "res/words.txt" file.
     */
    private static ArrayList<String> getWords() {
        ArrayList<String> temp = new ArrayList<>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader("Server_Java/res/words.txt"));
            String line;

            while ((line = reader.readLine()) != null) {
                temp.add(line);
            }
            System.out.println("words.txt is read");
            return temp;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static Player getPlayer(HashMap<Player, Integer> playerPoints) {
        int maxScore = 0;
        Player winner = null;
        for (Map.Entry<Player, Integer> entry : playerPoints.entrySet()) {
            Player p = entry.getKey();
            Integer score = entry.getValue();
            if (score > maxScore) {
                maxScore = score;
                winner = p;
            } else if (score == maxScore) {
                winner = null; // It's a draw
            }
        }
        return winner;
    }

    /**
     * This Java function logs in a player by checking their username and password in a list of registered users and
     * adding them to a list of online players if successful.
     *
     * @param player The player object contains the username and password of the player trying to log in.
     */
    @Override
    public void login(Player player) throws LoginException {
        String username = player.username;
        String password = player.password;
        User v = DataAccess.getUser(username);

        if (v == null) throw new LoginException("Player doesn't exist");
        if (!v.getPassword().equals(password)) throw new LoginException("Wrong credentials, try again.");
        if (onlinePlayers.contains(username)) throw new LoginException("Player is already online");
        onlinePlayers.add(username);
        System.out.println("Player " + username + " is online");
    }

    /**
     * This Java function starts a game and adds a player to an existing game or creates a new game if none exist, with a
     * timer.
     *
     * @param player The player who is starting or joining the game.
     * @return The method is returning a Game object.
     */
    @Override
    public Game startGame(Player player) throws StartGameException {
        // if a game is still waiting for players
        if (GAME_WAITING) {
            System.out.println(player.username + "has joined");
            // Retrieve the list of players from the latest game.
            ArrayList<Player> playerArrayList = new ArrayList<>(Arrays.asList(gameArrayList.get(gameArrayList.size() - 1).players)); // empty

            // Add this new player to the list
            playerArrayList.add(player);
            // update gameArrayList's list of players
            gameArrayList.get(gameArrayList.size() - 1).players = playerArrayList.toArray(new Player[0]);

            // Synchronized to timerCount
            try {
                timerJoin(10 - timerCount);
            } catch (InterruptedException | ExecutionException e) {
                JOptionPane.showMessageDialog(null, "Error joining game" + e.getMessage());
            }

            return gameArrayList.get(gameArrayList.size() - 1);

        } else {
            GAME_WAITING = true;
            // Create a new Game if there's no Game Waiting
            Game newGame = new Game(String.valueOf(gameArrayList.size()), new Player[0], new Round[0], "", new DataAccess().getSettings().getRoundTime(), new DataAccess().getSettings().getRoundWin(), false, 0);

            // Add the creator to the list of players of the game that will be added to list of games
            newGame.players = new Player[]{player};
            gameArrayList.add(newGame);

            System.out.println("New game created: " + newGame.id);
            System.out.println("Creator: " + newGame.players[0].username);

            try {
                timer(DataAccess.getSettings().getWaitingTime());
            } catch (InterruptedException | ExecutionException e) {
                JOptionPane.showMessageDialog(null, "Error joining game" + e.getMessage());
            }

            boolean validGame = checkPlayers(newGame.id);
            GAME_WAITING = false;

            if (validGame) {
                startRoundWaiting(newGame);
                return newGame;
            } else {
                gameArrayList.remove(newGame);
                System.out.println("Game " + newGame.id + " is disbanded due to lack of players");
                throw new StartGameException("No one joined the game");
            }
        }
    }

    /**
     * Starts a countdown timer for the beginning of a new round for the specified game.
     *
     * @param game The game for which the round countdown is being initiated.
     */
    private void startRoundWaiting(Game game) {
        // Create a new Timer instance
        Timer timer = new Timer();
        // AtomicInteger is used to ensure thread-safe updates of the countdown timer
        AtomicInteger secondsLeft = new AtomicInteger(11);

        // Schedule a new TimerTask to run every second
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                // Decrement the countdown timer by one second
                int updatedSecondsLeft = secondsLeft.decrementAndGet();
                // Update the readyHashmap with the current countdown time for the game
                readyHashmap.put(game, updatedSecondsLeft);

                // If the countdown reaches 1 second
                if (updatedSecondsLeft == 1) {
                    // Initialize the roundHashmap for the game with a value of 10 (presumably the round duration)
                    roundHashmap.put(game, 0);
                    // Cancel the TimerTask to stop the countdown
                    cancel();
                }
            }
        }, 1000, 1000); // Delay of 1000 milliseconds (1 second) before first execution, repeat every 1000 milliseconds (1 second)
    }

    /**
     * This Java function returns an integer value for a given game ID.
     *
     * @param gameId The parameter "gameId" is a String variable that represents the unique identifier of a game.
     * @return The method is returning an integer value stored in the variable `anInt`.
     */
    @Override
    public int timeChecker(String gameId) {
        if (gameId.isEmpty()) {
            return anInt;
        } else {

            int i = 0;
            for (HashMap.Entry<Game, Integer> set : roundHashmap.entrySet()) {
                if (set.getKey().id.equals(gameId)) {
                    i = set.getValue();
                }
            }
            return i;
        }
    }

    /**
     * Retrieves the remaining time for the current round of a specific game.
     *
     * @param gameId The unique ID of the game for which the remaining round time is being requested.
     * @return The remaining time in seconds for the current round of the specified game.
     */
    @Override
    public int roundTime(String gameId) {
        int remainingTime = 0;
        // Iterate through the entries in the readyHashmap
        for (HashMap.Entry<Game, Integer> entry : readyHashmap.entrySet()) {
            // Check if the current entry's game ID matches the provided gameId
            if (entry.getKey().id.equals(gameId)) {
                // If a match is found, set the remaining time to the value associated with this game
                remainingTime = entry.getValue();
            }
        }
        // Return the remaining time for the round
        return remainingTime;
    }

    @Override
    public void removePlayer(String player, String gameId) {
        ArrayList<Player> playerArrayList = new ArrayList<>(Arrays.asList(gameArrayList.get(Integer.parseInt(gameId)).players));
        playerArrayList.removeIf(player1 -> player1.username.equals(player));
        gameArrayList.get(Integer.parseInt(gameId)).players = playerArrayList.toArray(new Player[0]);
        System.out.println("Player " + player + " left game " + gameId);
    }

    /**
     * The function creates a timer that prints numbers from 1 to the specified number of seconds, with a delay of 1 second
     * between each number.
     *
     * @param seconds The parameter "seconds" is an integer value representing the number of seconds for which the timer
     *                will run.
     */
    private void timerJoin(int seconds) throws InterruptedException, ExecutionException {
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        List<Future<Integer>> futures = new ArrayList<>(seconds);
        for (int i = 0; i < seconds; i++) {
            int j = i;
            futures.add(scheduler.schedule(() -> j, i + 1, TimeUnit.SECONDS));
        }
        for (Future<Integer> future : futures) {
            int i = future.get() + 1;

        }
    }

    /**
     * This method is used for the timer.
     *
     * @param seconds The parameter "seconds" is an integer value representing the number of seconds for which the timer
     *                will run.
     */
    private void timer(int seconds) throws InterruptedException, ExecutionException {
        timerCount = 1;
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        List<Future<Integer>> futures = new ArrayList<>(seconds);
        System.out.print("Start");
        for (int i = 0; i < seconds; i++) {
            int j = i;
            futures.add(scheduler.schedule(() -> j, i + 1, TimeUnit.SECONDS));
        }
        for (Future<Integer> future : futures) {

            timerCount = future.get() + 1;
            anInt = timerCount;
            System.out.print(" " + (timerCount) + " ");
        }
        System.out.println("End");
    }

    /**
     * This Java function retrieves the letters for a round in a game, generates new letters if necessary, and returns the
     * round object.
     *
     * @param player The player parameter is a String that represents the name or identifier of the player who is
     *               requesting the letters for the current round.
     * @param gameId The gameId parameter is a String that represents the unique identifier of a game.
     * @return The method is returning a Round object.
     */
    @Override
    public Round getLetters(String player, String gameId) {
        ArrayList<Round> rounds = new ArrayList<>(Arrays.asList(gameArrayList.get(Integer.parseInt(gameId)).rounds));

        if (gameArrayList.get(Integer.parseInt(gameId)).players.length < 2) {
            Round round = new Round(String.valueOf(1), new char[0], new Words[0], "", "invalid");
            rounds.add(round);
            // Set the round array in the game with the arraylist
            gameArrayList.get(Integer.parseInt(gameId)).rounds = rounds.toArray(new Round[0]);
            System.out.println("Invalid game, last player:  " + player);
            return round;
        } else if (rounds.isEmpty()) {
            Round round = new Round(String.valueOf(1), generateRandomCharArray(), new Words[0], "", "initial");
            // Add the round to the arraylist
            rounds.add(round);
            // Set the round array in the game with the arraylist
            gameArrayList.get(Integer.parseInt(gameId)).rounds = rounds.toArray(new Round[0]);
            System.out.println("First round created " + player);
            return round;
        } else if (rounds.get(rounds.size() - 1).status.equals("initial")) {
            return rounds.get(rounds.size() - 1);
        } else {
            Round round = new Round(String.valueOf(rounds.size() + 1), generateRandomCharArray(), new Words[0], "", "initial");
            // Add the round to the arraylist
            rounds.add(round);
            // Set the round array in the game with the arraylist
            gameArrayList.get(Integer.parseInt(gameId)).rounds = rounds.toArray(new Round[0]);
            return round;
        }
    }


    //TODO make it so that only those who pressed the ready button will be able to play the game

    /**
     * This method is used to generate a random character array of length 20. It will have exactly 7 vowels and 13 consonants.
     *
     * @return A random character array of length 20 containing exactly 7 vowels and 13 consonants.
     */
    public char[] generateRandomCharArray() {
        Random random = new Random();
        int[] CONSONANT_FREQ = {8981, 20075, 19405, 6837, 15414, 10879, 819, 4405, 25611, 13050, 34466, 14327, 945, 35166, 44769, 33817, 5016, 4244, 1365, 7649, 1953};
        char[] CONSONANTS = {'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'};
        char[] VOWELS = {'a', 'e', 'i', 'o', 'u'};

        char[] arr = new char[20];
        int numVowels = 7;
        int numConsonants = 13;
        int vowelCount = 0;
        int consonantCount = 0;

        for (int i = 0; i < 20; i++) {
            if (vowelCount < numVowels && (consonantCount >= numConsonants || random.nextBoolean())) {
                arr[i] = VOWELS[random.nextInt(VOWELS.length)]; // pick a random vowel
                vowelCount++;
            } else {
                int totalConsonantFreq = 0;
                for (int freq : CONSONANT_FREQ) {
                    totalConsonantFreq += freq;
                }
                int randFreq = random.nextInt(totalConsonantFreq); // generate a random number between 0 and the total frequency of all consonants
                int index = 0;
                while (randFreq >= CONSONANT_FREQ[index]) { // find the consonant that corresponds to the random frequency
                    randFreq -= CONSONANT_FREQ[index];
                    index++;
                }
                arr[i] = CONSONANTS[index];
                consonantCount++;
            }
        }
        return arr;
    }

    /**
     * This function starts a round in a game, sets a timer for 10 seconds, and ends the round by validating answers and
     * changing the round status to "ended".
     *
     * @param gameId The ID of the game for which the round is being started.
     * @return A boolean value of false is being returned.
     */
    @Override
    public synchronized boolean startRound(String player, String gameId) {
        // set the status of the round to start
        int roundIndex = gameArrayList.get(Integer.parseInt(gameId)).rounds.length - 1;
        if (gameArrayList.get(Integer.parseInt(gameId)).isGameOver) {
            System.out.println("The game is over. The winner is " + gameArrayList.get(Integer.parseInt(gameId)).winner);
            return false;
        }
        if (!gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].status.equals("start")) {
            ArrayList<String> validWords = checkAllPossibleWords(gameId);
            validWords.sort((s1, s2) -> Integer.compare(s2.length(), s1.length()));

            System.out.println(validWords);

            gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].status = "start";
            System.out.println("Starting round for game " + gameId);

            Timer timer = new Timer();
            int roundTime = gameArrayList.get(Integer.parseInt(gameId)).roundTime;
            AtomicInteger secondsLeft = new AtomicInteger(roundTime);
            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    int updatedSecondsLeft = secondsLeft.decrementAndGet();
                    Game game = gameArrayList.get(Integer.parseInt(gameId));
                    roundHashmap.put(game, updatedSecondsLeft);
                    if (updatedSecondsLeft == 1 && player.isEmpty()) {
                        readyHashmap.put(game, 10);

                        System.out.println("Round has ended");
                        evaluateAnswers(gameId);

                        if (game.rounds.length >= game.roundWins) {
                            checkWinner(game);
                            Player winnerPlayer = null;
                            for (Player player : gameArrayList.get(Integer.parseInt(game.id)).players) {
                                if (player.username.equals(game.winner)) {
                                    winnerPlayer = player;
                                    break;
                                }
                            }
                            if (winnerPlayer != null) {
                                int winnerScore = overallPlayerPoints.get(winnerPlayer);
                                game.winnerScore = winnerScore;
                                System.out.println(game.winner + " has won the game"+" score: "+ winnerScore);
                                DataAccess.updateScore(winnerScore, game.winner);
                                overallPlayerPoints.clear();
                            } else {
                                System.out.println("Winner player not found in the game players list.");
                            }
                        }
                        cancel();
                    }
                }
            }, 1000, 1000);
            return true;
        }
        return false;
    }



    private void checkWinner(Game game) {
        HashMap<String, Integer> winCountMap = new HashMap<>();
        for (Round round : gameArrayList.get(Integer.parseInt(game.id)).rounds) {
            String winner = round.winner;
            if (!winner.isEmpty()) {
                winCountMap.put(winner, winCountMap.getOrDefault(winner, 0) + 1);
                if (winCountMap.get(winner) == game.roundWins) {
                    game.isGameOver = true;
                    System.out.println("TOTAL GAME ROUND WINS: " + game.roundWins);
                    System.out.println("GAME " + game.id + "has a winner: " + winner );
                    gameArrayList.get(Integer.parseInt(game.id)).winner = winner;
                    DataAccess.updateWin(winner);
                    break;
                }
            }
        }
    }

    /**
     * The function validates the words of a game and determines the winner based on the longest word/s submitted by the
     * players.
     *
     * @param gameId The parameter `gameId` is a String variable that represents the unique identifier of a game. It is
     *               used to access the corresponding game object in the `gameArrayList` ArrayList.
     */
    private void evaluateAnswers(String gameId) {
        System.out.println("Checking round winner for game " + gameId);

        int roundIndex = gameArrayList.get(Integer.parseInt(gameId)).rounds.length - 1;

        // Get the words from the latest round
        ArrayList<Words> wordsArrayList = new ArrayList<>(Arrays.asList(gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].wordsSentByPlayers));


        if (!wordsArrayList.isEmpty()) { // If the round words is not empty
            HashMap<Player, Integer> playerPoints = new HashMap<>(); // To keep track of total points

            for (Words word : wordsArrayList) {
                // Check if the word is unique among all words
                long count = wordsArrayList.stream().filter(w -> w.word.equals(word.word)).count();
                if (count == 1) { // The word is unique
                    Player player = Arrays.stream(gameArrayList.get(Integer.parseInt(gameId)).players)
                            .filter(p -> p.username.equals(word.player))
                            .findFirst()
                            .orElse(null); // Handle player not found
                    if (player != null) {
                        // Add the length of the word to the player's score
                        playerPoints.put(player, playerPoints.getOrDefault(player, 0) + word.word.length());
                    } else {
                        System.err.println("Player " + word.player + " not found");
                    }
                }
            }

            Player[] players = gameArrayList.get(Integer.parseInt(gameId)).players;
            for (Player player : players) {
                player.score += playerPoints.getOrDefault(player, 0);
            }

            Player winner = getPlayer(playerPoints);
            if (winner != null) {
                gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].winner = winner.username;
                int roundScore = playerPoints.getOrDefault(winner, 0);
                System.out.println(roundScore + " points to " + winner.username);
                overallPlayerPoints.put(winner, overallPlayerPoints.getOrDefault(winner, 0) + roundScore);
            } else {
                gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].winner = "draw";
            }
            gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].status = "ended";
            Game game = gameArrayList.get(Integer.parseInt(gameId));
            printPlayerScores();
            startRoundWaiting(game);
        } else {
            System.out.println("No words were submitted. The round is a draw.");
            gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].winner = "draw";
            gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex].status = "ended";
            Game game = gameArrayList.get(Integer.parseInt(gameId));
            startRoundWaiting(game);
        }
    }

    public void printPlayerScores() {
        for (Map.Entry<Player, Integer> entry : overallPlayerPoints.entrySet()) {
            Player player = entry.getKey();
            Integer score = entry.getValue();
            System.out.println("Player: " + player.username + ", Score: " + score);
        }
    }

    /**
     * The function sends a word to a game and checks if it is valid, and if so, adds it to the list of words sent by
     * players for the current round.
     *
     * @param word The parameter "word" is an object of the class "Words" which contains information about a word sent by a
     *             player in a game. It includes the word itself, the ID of the game, and the user it belongs to.
     * @return a TRUE value if the word is more than 5 letters.
     */
    @Override
    public boolean sendWord(Words word) throws SendWordException {
        // gets the possible words
        ArrayList<String> validWords = checkAllPossibleWords(word.gameId);
        int roundIndex = gameArrayList.get(Integer.parseInt(word.gameId)).rounds.length - 1;
        // checks if the round is still ongoing
        if (gameArrayList.get(Integer.parseInt(word.gameId)).rounds[roundIndex].status.equals("ended")) {
            throw new SendWordException("Round has ended");
        }
        // checks if the word is more than 5 letters
        System.out.println(word.word.length());
        if (word.word.length() < 4) throw new SendWordException("Sent word is less than 4 letters");
        // checks is the word is valid
        if (!validWords.contains(word.word)) throw new SendWordException("Send word is not valid");

        else { // if valid
            // gets the words array on the round and put it in an arraylist
            ArrayList<Words> wordsArrayList = new ArrayList<>(Arrays.asList(
                    gameArrayList.get(Integer.parseInt(word.gameId)).rounds[roundIndex].wordsSentByPlayers));
            // add the new valid word in the arraylist
            System.out.println("Player " + word.player + " added " + word.word);
            wordsArrayList.add(word);
            // update the word array with the arraylist
            gameArrayList.get(Integer.parseInt(word.gameId)).rounds[roundIndex].wordsSentByPlayers = wordsArrayList.toArray(new Words[0]);
            return true;
        }
    }

    /**
     * Used to iterate through a list of words and checks if each word can be formed using the random letters of the
     * last round.
     *
     * @param gameId Used to be able to identify the game
     * @return The validWords
     */
    private ArrayList<String> checkAllPossibleWords(String gameId) {
        int roundIndex = gameArrayList.get(Integer.parseInt(gameId)).rounds.length - 1;
        Round round = gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex];
        ArrayList<String> validWords = new ArrayList<>();
        for (String word : words) {
            if (canBeFormed(word, round.randomLetters)) {
                validWords.add(word);
            }
        }
        return validWords;
    }

    /**
     * The function checks if a given word can be formed using a given array of random characters.
     *
     * @param word            The word that needs to be checked if it can be formed using the characters in the randomCharArray.
     * @param randomCharArray An array of characters that are randomly generated and used to form words.
     * @return The method `canBeFormed` returns a boolean value indicating whether the given `word` can be formed using the
     * characters in the `randomCharArray`.
     */
    private boolean canBeFormed(String word, char[] randomCharArray) {
        int[] charCounts = new int[26];
        for (char c : randomCharArray) {
            charCounts[c - 'a']++;
        }
        for (char c : word.toCharArray()) {
            if (--charCounts[c - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * The function checks if a game has at least two players.
     *
     * @param id The parameter "id" is a String variable that represents the ID of a game in an ArrayList of Game objects.
     *           The method uses this ID to retrieve the corresponding Game object from the ArrayList and then checks if the number
     *           of players in the game is greater than 1. The method returns a boolean value
     * @return The method is returning a boolean value. It is checking if the number of players in a game (identified by
     * the input id) is greater than 1, and returning true if it is, and false otherwise.
     */
    private boolean checkPlayers(String id) {
        Game checkGame = gameArrayList.get(Integer.parseInt(id));
        return checkGame.players.length > 1;
    }

    /**
     * This method is used to get the winner of the round of the game with the given gameId
     *
     * @param gameId This is used to identify the game
     * @return it returns the winner of the last rond
     */


    @Override
    public Round getWinner(String gameId) {
        int roundIndex = gameArrayList.get(Integer.parseInt(gameId)).rounds.length - 1;
        return gameArrayList.get(Integer.parseInt(gameId)).rounds[roundIndex];
    }


    /**
     * The function returns the top 5 players and their number of wins in a 2D array.
     *
     * @return An object of the class TopPlayers is being returned with the value in the 2D array.
     */
    @Override
    public TopPlayers getTopPlayers() {
        ArrayList<String> topPlayerList = new ArrayList<>();
        ArrayList<User> users = DataAccess.getLeaderboardScore();
        for (User user : users) {
            String playerInfo = user.getUsername() + ", Wins: " + user.getWins();
            topPlayerList.add(playerInfo);
        }
        TopPlayers topPlayers = new TopPlayers();
        topPlayers.topPlayer = topPlayerList.toArray(new String[0]); // Convert ArrayList to array
        return topPlayers;
    }

    // The code is an implementation of a method called `playerWins` in a Java class. This method takes a the Game
    // object as input and returns a Game object.
    @Override
    public Game playerWins(Game game) {
        return gameArrayList.stream().filter(g -> g.id.equals(game.id)).findFirst().orElseThrow(()-> new RuntimeException("Cannot find game"));
    }

    // The code is implementing a method called "logout" that takes a Player object as a parameter and returns a
    // boolean value. It prints a message indicating that the player has logged out and removes the player's username from
    // a collection of online players. The boolean value returned indicates whether the removal was successful or not.
    @Override
    public boolean logout(Player player) {
        System.out.println("Player " + player.username + " logged out ");
        return onlinePlayers.remove(player.username);
    }
}


