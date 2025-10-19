package GUI;

import BoggledGame.TopPlayers;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.GridPane;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;
import java.util.stream.Collectors;

public class TopPlayersController implements Initializable {

    @FXML
    public Label players;

    @FXML
    public Button back;

    @FXML
    public Label score;

    @FXML
    public GridPane list;

    @FXML
    public void handleButton() {
        // get a reference to the current stage
        Stage stage = (Stage) back.getScene().getWindow();
        stage.close();


        // load the FXML file for the menu interface
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/fxml/Menu.fxml"));
        Stage stage1 = new Stage();
        try {
            // load the menu interface
            Parent root = loader.load();
            stage1.setTitle(BoggledClient.currentPlayer.username);
            // create a new scene with the menu interface
            Scene scene = new Scene(root);

            // set the scene on the stage and show it
            stage1.setScene(scene);
            stage1.show();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        list.getChildren().clear();
        TopPlayers topPlayer = BoggledClient.BoggledImpl.getTopPlayers();
        String[] topPlayersArray = topPlayer.topPlayer;
        String[][] playerInfoArray = new String[topPlayersArray.length][2];
        for (int i = 0; i < topPlayersArray.length; i++) {
            String playerInfo = topPlayersArray[i];
            String[] parts = playerInfo.split(", Wins: ");
            String playerName = parts[0]; // Extract player name
            String wins = parts[1]; // Extract wins
            playerInfoArray[i][0] = playerName.trim(); // Store player name in the 2D array
            playerInfoArray[i][1] = wins.trim(); // Store wins in the 2D array
        }
        populatePlayerNames(playerInfoArray);
        populateWinCounts(playerInfoArray);
        Platform.runLater(()-> {
            Stage stage = (Stage) back.getScene().getWindow();
            stage.setOnCloseRequest(windowEvent -> {
                handleButton();
            });
        });

    }

    private void populatePlayerNames(String[][] playerInfoArray) {
        String[][] players = playerInfoArray;
        List<String[]> filteredPlayers = Arrays.stream(players)
                .filter(player -> Integer.parseInt(player[1]) > 0).sorted((p1, p2) -> Integer.compare(Integer.parseInt(p2[1]), Integer.parseInt(p1[1]))).collect(Collectors.toList());
        for (int i = 0; i < filteredPlayers.size(); i++) {
            String playerName = filteredPlayers.get(i)[0];
            Label playerLabel = new Label(playerName);
            list.addRow(i, playerLabel);
        }
    }

    private void populateWinCounts(String[][] playerInfoArray) {
        String[][] players = playerInfoArray;
        List<String[]> filteredPlayers = Arrays.stream(players)
                .filter(player -> Integer.parseInt(player[1]) > 0).sorted((p1, p2) -> Integer.compare(Integer.parseInt(p2[1]), Integer.parseInt(p1[1]))).collect(Collectors.toList());
        for (String[] filteredPlayer : filteredPlayers) {
            String winCount = filteredPlayer[1];
            Label winCountLabel = new Label(winCount);
            list.addColumn(1, winCountLabel);
        }
    }
}
