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
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class MenuController implements Initializable {
    public static Game game;
    @FXML
    public Label labelTitle;
    @FXML
    public Label startTimer;
    @FXML
    public Button StartGame;

    @FXML
    public Button topPlayers;


    @FXML
    private Button exitGame;

    Thread thread;

    public static void newAlert(String s, String s1, String s2) {
        Platform.runLater(() -> {
            Alert alert = new Alert(Alert.AlertType.INFORMATION);
            alert.setTitle(s);
            alert.setHeaderText(s1);
            alert.setContentText(s2);

            Stage stage = (Stage) alert.getDialogPane().getScene().getWindow();
            stage.setAlwaysOnTop(true); // Ensure the alert is shown on top

            Timeline timeline = new Timeline(new KeyFrame(Duration.seconds(6), event -> {
                Platform.runLater(alert::close);
            }));

            timeline.setCycleCount(1);
            timeline.play();
            Platform.runLater(alert::showAndWait);
        });
    }


    @FXML
    private void StartGameButtonClicked() {
        disableButtons(true);
        Task<Void> task = new Task<Void>() {
            private Timeline timeline; // Declare timeline outside of call method
            private int initialSeconds;

            @Override
            protected Void call() throws Exception {
                initialSeconds = timerSeconds(); // Get the initial time from the server
                final int[] remainingSeconds = {initialSeconds};

                Platform.runLater(() -> startTimer.setText(String.valueOf(remainingSeconds[0]))); // Update UI with initial time

                timeline = new Timeline(new KeyFrame(Duration.seconds(1), event -> {
                    if (remainingSeconds[0] > 0) {
                        remainingSeconds[0]--; // Decrement the countdown
                        Platform.runLater(() -> startTimer.setText(String.valueOf(remainingSeconds[0])));
                    } else {
                        Platform.runLater(() -> startTimer.setText("0"));
                        timeline.stop();
                    }
                }));
                timeline.setCycleCount(initialSeconds); // Set the cycle count to match initial time

                // Start the timeline after setting up
                Platform.runLater(timeline::play);

                // Start the game
                game = BoggledClient.BoggledImpl.startGame(BoggledClient.currentPlayer);
                // You can perform any other necessary operations related to the game here
                return null;
            }
        };

        task.setOnSucceeded(event -> {
            thread.interrupt();
            loadFXML("/fxml/MainInterface.fxml", "GAME");
        });

        task.setOnFailed(event -> {
            disableButtons(false);
            Throwable exception = task.getException();
            String errorMessage;
            if (exception instanceof StartGameException) {
                StartGameException startGameException = (StartGameException) exception;
                errorMessage = startGameException.reason;
            } else {
                errorMessage = exception.getMessage();
            }
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Game start failed");
            alert.setHeaderText(null);
            alert.setContentText(errorMessage);
            alert.showAndWait();
        });

        thread = new Thread(task);
        thread.setDaemon(true);
        thread.start();
    }

    private int timerSeconds() {
        return BoggledClient.BoggledImpl.timeChecker("");
    }

    private void disableButtons(boolean b){
        StartGame.setDisable(b);
        topPlayers.setDisable(b);
        exitGame.setDisable(b);
    }

    @FXML
    private void topPlayersButtonClicked() {
        loadFXML("/fxml/TopPlayers.fxml", "Top Players");
    }

    @FXML
    public void exitGameButtonClicked() {
        BoggledClient.BoggledImpl.logout(BoggledClient.currentPlayer);
        Stage stage = (Stage) exitGame.getScene().getWindow();
        stage.close();
        System.exit(1);
    }

    private void loadFXML(String fxmlFile, String stageTitle) {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource(fxmlFile));
            Parent root = fxmlLoader.load();

            Stage stage = new Stage();
            stage.setTitle(stageTitle);
            stage.setScene(new Scene(root));
            stage.show();

            Stage currentStage = (Stage) StartGame.getScene().getWindow();
            currentStage.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        Platform.runLater(()-> {
            Stage stage = (Stage) exitGame.getScene().getWindow();
            stage.setOnCloseRequest(windowEvent -> {
                exitGameButtonClicked();
            });
        });
    }
}