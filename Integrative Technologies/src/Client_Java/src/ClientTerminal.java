import BoggledGame.*;
import org.omg.CORBA.ORB;
import org.omg.CORBA.Object;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;

import java.util.Scanner;

public class ClientTerminal {
    public static BoggledInterface BoggledImpl;

    public static void main(String[] args) {
        try{
            ClientTerminal client = new ClientTerminal();
            client.run(args);
        }catch(Exception e){
            e.printStackTrace();
            System.exit(1);
        }
    }

    public Player logIn(){
        Scanner kbd = new Scanner(System.in);
        System.out.println("Name: ");
        String name = kbd.nextLine();
        System.out.println("Password: ");
        String password = kbd.nextLine();

        return new Player(name,password,(short)1,0);
    }

    public String startRound() {
        Scanner kbd = new Scanner(System.in);
        System.out.println("Type 1 to start ");
        return kbd.nextLine();
    }

    public void run(String[] args) {

        try {
            ORB orb = ORB.init(args, null);
            Object objRef = orb.resolve_initial_references("NameService");
            NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);
            String name = "Boggled";
            BoggledImpl = BoggledInterfaceHelper.narrow (ncRef.resolve_str(name));
        }catch(Exception e){
            e.printStackTrace();
        }


        Player player = null;
        Game game = null;
        Round round = null;
        Words words = null;
        boolean startRound = false;
        boolean loggedIn = false;

        while(!loggedIn) {
            try {
                player = logIn();
                BoggledImpl.login(player);
                loggedIn = true;
            } catch (LoginException e) {
                System.out.println("Player is not registered");
            }
        }

        boolean gameStarted = false;
        while(!gameStarted) {
            try {
                gameStarted = startGameButton();
                game = BoggledImpl.startGame(player);
            } catch (StartGameException e) {
                System.out.println("No Player found");
                gameStarted = false;
            }
        }

        System.out.println(game.id);
        System.out.println("Players joined: ");
        for (Player player1 : game.players) {
            System.out.println(player1.username);
            System.out.println(player1.password);
        }

        round = BoggledImpl.getLetters(player.username,game.id);

        System.out.println("Type 1 to start the round");
        Scanner kbd = new Scanner(System.in);
        int startButton = Integer.parseInt(kbd.nextLine());
        while (!startRound) {
            startRound = BoggledImpl.startRound(player.username,game.id);
        }

        if(startButton == 1) {
            try {
                sendWordPrompt(round);
                BoggledImpl.sendWord(sendWord(game,player));
            } catch (SendWordException e) {
                System.out.println("Word not accepted");
            }

        }
    }

    /**
     * This function prompts the user to start a game or exit the program and returns a boolean value based on the user's
     * input.
     *
     * @return A boolean value is being returned.
     */
    public boolean startGameButton(){
        Scanner kbd = new Scanner(System.in);
        System.out.println("Type 1 to start a game, 2 to exit game");
        int startGame = Integer.parseInt(kbd.nextLine());
        if(startGame == 1){
            System.out.println("looking for players");
            return true;
        } else if (startGame == 2){
            System.out.println("Exiting game");
            System.exit(0);
        } else {
            System.out.println("No choices picked");
        }
        return false;
    }

    /**
     * This function prompts the user to type a word using the random letters provided in the current round.
     *
     * @param round The "round" parameter is an object of the Round class, which contains information about the current
     * round of the game, the randomly generated letters for that round. The method "sendWordPrompt" takes this
     * object as input and uses it to display the letters to be used by the players
     */
    public void sendWordPrompt(Round round){
        System.out.println("Letters: ");
        for(char letter : round.randomLetters){
            System.out.print(letter + ", ");
        }

        System.out.println("Type a word from the letters:");
    }

    /**
     * This Java function prompts the user to input a word and returns a new Words object with the game ID, player
     * username, and the inputted word.
     *
     * @param game The game parameter is an object of the Game class, which contains information about the current game
     * being played.
     * @param player The "player" parameter is an object of the class "Player" which represents a player in the game. It
     * contains information about the player such as their username. This parameter is used
     * to identify which player is sending the word.
     * @return A new instance of the `Words` class with the important information about the which game, which player
     * and what word was sent.
     */
    public Words sendWord(Game game, Player player){
        Scanner kbd = new Scanner(System.in);
        System.out.println(": ");
        String word = kbd.nextLine();
        return new Words(game.id, player.username, word,word.length());
    }
}
