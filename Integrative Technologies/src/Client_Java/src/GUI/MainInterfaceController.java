package GUI;

import BoggledGame.*;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.KeyCode;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.io.IOException;
import java.net.URL;
import java.util.*;

public class MainInterfaceController implements Initializable {

    static HashMap<String, Short> wins = new HashMap<>();

    Thread thread;
    Thread thread1;
    Timeline timeline, timeline2;
    Task<Void> task;
    Task<Void> task1;

    char[] randomLetter;

    boolean readyButtonPressed = true;

    @FXML
    public Label Boggled;

    @FXML
    public Button ExitButton;

    @FXML
    public Button PlayerButton;

    @FXML
    public Button sendButton;

    @FXML
    public TextField nextRound;

    @FXML
    public Label timer;

    @FXML
    public Label game;

    @FXML
    public Label round;

    @FXML
    public TextField input;

    @FXML
    public TextField randomLetters;

    @FXML
    public TextArea validWords;
    private static boolean fiveSeconds = true;

    @FXML
    private void sendButtonClicked() {
        try {
            boolean valid = BoggledClient.BoggledImpl.sendWord(new Words(MenuController.game.id, BoggledClient.currentPlayer.username, input.getText(),input.getText().length()));
            if (valid) {
                String stringBuilder = validWords.getText() +
                        input.getText() + "  ";
                validWords.clear();

                validWords.setText(stringBuilder);
                input.clear();
            }
        } catch (SendWordException e) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Send word error");
            alert.setHeaderText(null);
            alert.setContentText(e.reason);
            alert.showAndWait();
        }
    }

    static boolean haveRan = false;

    private void checkGameWinner(Game game) {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                Game game1 = BoggledClient.BoggledImpl.playerWins(game);
                if (!game1.winner.isEmpty()) {
                    if (!haveRan) {
                        timer.cancel();
                        stopThreads();
                        Platform.runLater(() -> loadFXML("/fxml/Menu.fxml", BoggledClient.currentPlayer.username, true, ExitButton));
                            MenuController.newAlert("WINNER!!!", "Player " + game1.winner + " is the game winner ", "SCORE: " + game1.winnerScore);
                        haveRan = true;
                    }
                }
            }
        }, 1000, 1000);
    }
    private void roundWinnerTimer() {
        Round round1;
        do {
            System.out.println("Getting round");
            System.out.println();
            round1 = BoggledClient.BoggledImpl.getWinner(MenuController.game.id);

        } while (!round1.status.equals("ended"));

        if (round1.id.equals("2")) {
            startGettingGameWinner();
        }

        if (round1.winner.equals("")) {
            newAlert("No winner", "No one sent anything", "");
            clearFields();
            startTimer();
        } else {
            // Check if it's a draw
            if (round1.winner.contains("draw:")) {
                String draw = round1.winner.replace("draw:", "");
                String[] draws = draw.split(",");
                newAlert("We have a draw", "Round: " + round1.id, "Between players " + Arrays.toString(draws));
                Platform.runLater(() -> nextRound.setText("DRAW"));
                clearFields();
            } else {
                // It's not a draw, we have a winner
                newAlert("We have a winner", "Round: " + round1.id, "Congratulations Player: " + round1.winner);
                clearFields();
                Platform.runLater(() -> nextRound.setText("WINNER"));
                updateWins(round1);
            }
            startTimer();
        }
    }

    private void startGettingGameWinner() {
        if (fiveSeconds) {
            checkGameWinner(MenuController.game);
        }
    }

    private void updateWins(Round round1) {
        for (Map.Entry<String, Short> entry : wins.entrySet()) {
            if (entry.getKey().equals(round1.winner)) {
                Short currentWins = entry.getValue();
                System.out.println(entry.getKey());
                entry.setValue((++currentWins));
                System.out.println(entry);
                System.out.println("Winner " + round1.winner);
                System.out.println("Wins " + currentWins);
                break;
            }
        }
    }

    private void clearFields() {
        validWords.setText("");
        randomLetters.setText("");
        input.setText("");
    }

    private void roundTimer() {
        Platform.runLater(() -> nextRound.setText("PLAYING"));
        // call this method for checking if there is a winner and reset the process again (Wait > Start > End)
        task1 = new Task<Void>() {
            @Override
            protected Void call() {
                timeline = new Timeline();
                timeline.getKeyFrames().add(new KeyFrame(Duration.seconds(.1), event -> {
                    // get seconds for how many are left before the round ends
                    int seconds = BoggledClient.BoggledImpl.timeChecker(MenuController.game.id);

                    if (seconds == 0) {// ignore
                    } else Platform.runLater(() -> timer.setText(String.valueOf(seconds)));
                    if (seconds == 1) {
                        roundWinnerTimer();
                        timeline.stop();
                    }
                }));
                timeline.setCycleCount(Timeline.INDEFINITE);
                timeline.play();
                return null;
            }
        };
        thread = new Thread(task1);
        thread.setDaemon(true);
        thread.start();
    }

    public void newAlert(String title, String header, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(header);
        alert.setContentText(content);

        Stage stage = (Stage) alert.getDialogPane().getScene().getWindow();
        stage.setAlwaysOnTop(true); // Ensure the alert is shown on top

        Timeline timeline = new Timeline(new KeyFrame(Duration.seconds(6), event -> {
            Platform.runLater(alert::close);
        }));

        timeline.setCycleCount(1);
        timeline.play();
        Platform.runLater(alert::showAndWait);


    }

    @FXML
    private void ExitButtonClicked() {
        BoggledClient.BoggledImpl.removePlayer(BoggledClient.currentPlayer.username, MenuController.game.id);
        stopThreads();
        loadFXML("/fxml/Menu.fxml",  BoggledClient.currentPlayer.username, true, ExitButton);
    }

    private void stopThreads() {
        System.out.println("STOPPPPPPPPP");
        if (task1 != null) {
            task.cancel();
            task1.cancel();
        }
        if (thread != null && thread.isAlive()) {
            thread.interrupt();
        }
        if (thread1 != null && thread1.isAlive()) {
            thread1.interrupt();
        }
        if (timeline != null) {
            timeline.stop();
            timeline2.stop();
        }
    }


    public void playerButtonClicked() {
        loadFXML("/fxml/playerlist.fxml", "Players joined", false, PlayerButton);
    }

    private void loadFXML(String fxmlFile, String stageTitle, boolean closeCurrent, Button button) {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(fxmlFile));
            Parent root = fxmlLoader.load();

            Stage stage = new Stage();
            stage.setTitle(stageTitle);
            stage.setScene(new Scene(root));
            stage.show();

            if (closeCurrent) {
                Stage currentStage = (Stage) button.getScene().getWindow();
                currentStage.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {

        for (Player player : MenuController.game.players) {
            MainInterfaceController.wins.put(player.username, (short) 0);
        }


        validWords.setEditable(false);
        randomLetters.setEditable(false);
        nextRound.setEditable(false);

        // set the game id
        game.setText("Game: " + MenuController.game.id);
        //wait for the players to press next button

        startTimer();

        input.setOnKeyPressed(event1 -> {
            if (event1.getCode() == KeyCode.ENTER && !sendButton.isCancelButton()) {
                sendButtonClicked();
            }
        });


        Platform.runLater(() -> {
            Stage stage = (Stage) ExitButton.getScene().getWindow();
            stage.setOnCloseRequest(windowEvent -> ExitButtonClicked());
        });

    }

    // This method is for letting the players know how many seconds are left to press the ready button
    public void startTimer() { // for waiting for players to press ready button
        Platform.runLater(() -> nextRound.setText("Waiting"));
        sendButton.setDisable(true);
        readyButtonPressed = true;
        System.out.println("Waiting for everyone to get ready");
        task = new Task<Void>() {
            @Override
            protected Void call() {
                timeline2 = new Timeline();
                timeline2.getKeyFrames().add(new KeyFrame(Duration.seconds(.1), event -> {
                    int seconds = BoggledClient.BoggledImpl.roundTime(MenuController.game.id);
                    System.out.println(seconds);
                    if (seconds == 5) {
                        fiveSeconds = true;
                        Round letter = BoggledClient.BoggledImpl.getLetters(BoggledClient.currentPlayer.username, MenuController.game.id);
                        if (letter.status.equals("invalid")) {
                            if (!haveRan){
                                stopThreads();
                                loadFXML("/fxml/Menu.fxml", BoggledClient.currentPlayer.username, true, ExitButton);
                                newAlert("Invalid Game", "You are the only player remaining", "");
                                haveRan = true;
                            }
                        }
                        randomLetter = letter.randomLetters;
                        Platform.runLater(() -> round.setText("Round: " + letter.id));
                    }
//                    System.out.println("Waiting seconds: " + seconds);
                    if (seconds == 0) {
                    } else {
                        Platform.runLater(() -> timer.setText(String.valueOf(seconds)));
                    }
                    if (seconds == 3) {
                        Platform.runLater(() -> nextRound.setText("READY"));
                    }
                    if (seconds == 2) {
                        Platform.runLater(() -> nextRound.setText("SET"));
                    }
                    // the round will now start
                    if (seconds == 1) {
                        // Stop the timeline when seconds reaches 0
                        timeline2.stop();
                        // disable the next round first
                        Platform.runLater(() -> nextRound.setText("GO !!!"));
                        // players can now send words
                        sendButton.setDisable(false);
                        // let the server know that the round will now start
                        BoggledClient.BoggledImpl.startRound("", MenuController.game.id);
                        // set the random letter for the users to see
                        StringBuilder text = new StringBuilder();
                        text.append("|  ");
                        for (char c : randomLetter) {
                            text.append(c).append("  |  ");
                        }
                        randomLetters.setText(text.toString());
                        roundTimer();
                    }
                }));
                timeline2.setCycleCount(Timeline.INDEFINITE);
                timeline2.play();
                return null;
            }
        };
        thread1 = new Thread(task);
        thread1.setDaemon(true);
        thread1.start();
    }
}

