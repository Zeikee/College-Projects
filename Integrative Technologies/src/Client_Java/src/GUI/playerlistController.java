package GUI;

import javafx.beans.property.SimpleObjectProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.stage.Stage;

import java.net.URL;
import java.util.Map;
import java.util.ResourceBundle;

public class playerlistController implements Initializable{

    @FXML
    public  TableView<Map.Entry<String, Short>> tableView;

    @FXML
    public TableColumn<Map.Entry<String, Short>, String> playerlist ;

    @FXML
    public TableColumn<Map.Entry<String, Short>, Short> rank;

    @FXML
    public Button backbutton;

        @FXML
        public void handlebackbuttonClicked () {
            Stage currentStage = (Stage) backbutton.getScene().getWindow();
            currentStage.close();
        }

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
            ObservableList<Map.Entry<String, Short>> playerData = FXCollections.observableArrayList();

            playerData.addAll(MainInterfaceController.wins.entrySet());

            try{
                tableView.setItems(playerData);

                playerlist.setCellValueFactory(data -> new SimpleStringProperty(data.getValue().getKey()));
                rank.setCellValueFactory(data -> new SimpleObjectProperty<>(data.getValue().getValue()));

                ScrollPane scrollPane = new ScrollPane(tableView);
                scrollPane.setPrefSize(400, 300);
                scrollPane.setFitToWidth(true);
                scrollPane.setFitToHeight(true);
                scrollPane.setHbarPolicy(ScrollPane.ScrollBarPolicy.NEVER);
                scrollPane.setVbarPolicy(ScrollPane.ScrollBarPolicy.ALWAYS);
            }catch (Exception e){
                System.out.println( e.getMessage());

            }
    }

}
