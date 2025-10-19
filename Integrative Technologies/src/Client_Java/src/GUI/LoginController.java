package GUI;

import BoggledGame.LoginException;
import BoggledGame.Player;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.stage.Stage;

import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class LoginController implements Initializable {
    @FXML
    private Button loginButton;

    @FXML
    private PasswordField password;

    @FXML
    private TextField username;

    @FXML
    public void loginButtonClicked() {
        System.out.println("Clicked");
        if (username.getText().isEmpty() || password.getText().isEmpty()){
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Login Failed");
            alert.setHeaderText(null);
            alert.setContentText("Fields must not be empty");
            alert.showAndWait();
        }else {
            String enteredUsername = username.getText();
            String enteredPassword = password.getText();


            Player player = new Player(enteredUsername, enteredPassword, (short) 0,0);
            System.out.println(player);
            try {
                BoggledClient.BoggledImpl.login(player);
                System.out.println("Login successful");
                BoggledClient.setCurrentPlayer(player);
                logInSuccess(player.username);
            } catch (LoginException e) {
                Alert alert = new Alert(Alert.AlertType.ERROR);
                alert.setTitle("Login Failed");
                alert.setHeaderText(null);
                alert.setContentText(e.reason);
                alert.showAndWait();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void logInSuccess(String name) {
        try {
            // Load the FXML file of the Menu GUI
            FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/fxml/Menu.fxml"));
            Parent root = fxmlLoader.load();

            // Create a new stage
            Stage stage = new Stage();
            stage.setTitle(name);

            // Set the scene of the new stage
            Scene scene = new Scene(root);
            stage.setScene(scene);

            // Show the new stage
            stage.show();

            // Close the current stage
            Stage currentStage = (Stage) loginButton.getScene().getWindow();
            currentStage.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        // Add the event listener for Enter key press on the username and password fields
        username.addEventHandler(KeyEvent.KEY_PRESSED, event -> {
            if (event.getCode() == KeyCode.ENTER) {
                password.requestFocus();
                event.consume();
            }
        });

        password.addEventHandler(KeyEvent.KEY_PRESSED, event -> {
            if (event.getCode() == KeyCode.ENTER) {
                loginButtonClicked();
                event.consume();
            } else if (event.getCode() == KeyCode.BACK_SPACE && password.getText().isEmpty()) {
                username.requestFocus();
                event.consume();
            }
        });
    }
}
