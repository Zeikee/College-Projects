import BoggledGame.Player;
import tables.Settings;
import tables.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class DataAccess {

    private static Connection con;

    public DataAccess() {
    }

    public static void setCon() {
        try {
            con = DriverManager.getConnection("jdbc:mysql://localhost:3306/boggled", "root", "");
            System.out.println("DataAccess Connection Successful");
        } catch (SQLException e) {
            System.out.println("Database connection failed: " + e.getMessage());
            System.exit(1);
        }
    }


    public static ArrayList<User> getLeaderboardScore() {
        ArrayList<User> leaderboard = new ArrayList<>();
        String query = "SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 5";
        try (PreparedStatement statement = con.prepareStatement(query)) {
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                String username = resultSet.getString("username");
                int score = resultSet.getInt("score");
                leaderboard.add(new User(username, "", score));
            }
        } catch (Exception e) {
            System.out.println("Failed to get top players");
        }
        return leaderboard;
    }

    public static void addUser(User user) throws Exception {
        String query = "INSERT INTO User (username, password, wins) VALUES (?, ?, ?)";
        PreparedStatement statement = con.prepareStatement(query);
        statement.setString(1, user.getUsername());
        statement.setString(2, user.getPassword());
        statement.setInt(3, user.getWins());
        statement.executeUpdate();
        System.out.println("User added successfully");

    }

    public static ArrayList<User> getUsers() {
        ArrayList<User> Users = new ArrayList<>();
        String query = "SELECT * FROM user";
        try (PreparedStatement statement = con.prepareStatement(query)) {
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                String username = resultSet.getString("username");
                String password = resultSet.getString("password");
                int wins = resultSet.getInt("wins");
                User user1 = new User(username, password, wins);
                Users.add(user1);
            }
        } catch (Exception e) {
            System.out.println("Failed to get users");
        }
        return Users;
    }

    public static void deleteUser(String username) throws Exception {
        String query = "DELETE FROM user WHERE username = ?";
        PreparedStatement statement = con.prepareStatement(query);
        statement.setString(1, username);
        int rowsAffected = statement.executeUpdate();
        if (rowsAffected == 0) {
            System.out.println("No user found with username " + username);
        } else {
            System.out.println("User deleted successfully");
        }
    }

    public static Settings getSettings() {
        String query = "SELECT * FROM settings";
        try (PreparedStatement statement = con.prepareStatement(query)) {
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                int roundTime = resultSet.getInt("round_time");
                int waitingTime = resultSet.getInt("waiting_time");
                int roundWin = resultSet.getInt("round_wins");
                return new Settings(roundTime, waitingTime, roundWin);
            }
        } catch (Exception e) {
            System.out.println("Failed to get settings");
        }
        return null;
    }

    public static void setSettings(Settings settings) throws Exception{
        String query = "UPDATE settings SET round_time = ?, waiting_time = ?, round_wins = ?";
        PreparedStatement statement = con.prepareStatement(query);
        statement.setInt(1, settings.getRoundTime());
        statement.setInt(2, settings.getWaitingTime());
        statement.setInt(3, settings.getRoundWin());
        statement.executeUpdate();
    }

    public static void editUser(String username, String password) throws Exception {
        String query = "UPDATE user SET password = ? WHERE username = ?";
        PreparedStatement statement = con.prepareStatement(query);
        statement.setString(1, password);
        statement.setString(2, username);
        int rowsAffected = statement.executeUpdate();
        if (rowsAffected == 0) {
            System.out.println("No user found with username " + username);
        } else {
            System.out.println("User updated successfully");
        }
    }


    public static User getUser(String username) {
        String query = "SELECT * FROM user WHERE username = ?";
        try (PreparedStatement statement = con.prepareStatement(query)) {
            statement.setString(1, username);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                String username1 = resultSet.getString("username");
                String password = resultSet.getString("password");
                int wins = resultSet.getInt("wins");
                return new User(username1, password, wins);
            }
        } catch (Exception e) {
            System.out.println("Failed to get users");
        }
        return null;
    }

    public static User searchUser(String username) {
        String query = "SELECT * FROM user WHERE username = ?";
        try (PreparedStatement statement = con.prepareStatement(query)) {
            statement.setString(1, username);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                String foundUsername = resultSet.getString("username");
                String password = resultSet.getString("password");
                int wins = resultSet.getInt("wins");
                return new User(foundUsername, password, wins);
            } else {
                System.out.println("No user found with username " + username);
                return null;
            }
        } catch (SQLException e) {
            System.out.println("Failed to search for user in the database: " + e.getMessage());
            return null;
        }
    }

    public static User getUserPass(String password) throws Exception {
        String query = "SELECT * FROM user WHERE password = ?";
        try (PreparedStatement statement = con.prepareStatement(query)) {
            statement.setString(1, password);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                String username = resultSet.getString("username");
                String password1 = resultSet.getString("password");
                int wins = resultSet.getInt("wins");
                return new User(username, password1, wins);
            } else {
                return null;
            }
        }
    }

    public static void updateScore(int winnerScore, String winner){
        try {
            String selectQuery = "SELECT score FROM leaderboard WHERE username = ?";
            PreparedStatement selectStmt = con.prepareStatement(selectQuery);
            selectStmt.setString(1, winner);
            ResultSet resultSet = selectStmt.executeQuery();
            if (resultSet.next()) {
                int existingScore = resultSet.getInt("score");
                if (winnerScore > existingScore) {
                    // If the new score is higher, update it
                    String updateQuery = "UPDATE leaderboard SET score = ? WHERE username = ?";
                    PreparedStatement updateStmt = con.prepareStatement(updateQuery);
                    updateStmt.setInt(1, winnerScore);
                    updateStmt.setString(2, winner);
                    updateStmt.executeUpdate();
                    System.out.println("Score updated successfully for user with score " + winnerScore);
                }
            } else {
                String insertQuery = "INSERT INTO leaderboard (username, score) VALUES (?, ?)";
                PreparedStatement insertStmt = con.prepareStatement(insertQuery);
                insertStmt.setString(1, winner);
                insertStmt.setInt(2, winnerScore);
                insertStmt.executeUpdate();
                System.out.println("Score inserted successfully for user with score " + winnerScore);
            }
        } catch (SQLException e) {
            System.out.println("Failed to update score in the database: " + e.getMessage());
        }
    }


    // todo questionable query
    public static void updateWin(String winner) {
        String query = "UPDATE user SET wins = wins + 1 WHERE username =?";

        try (PreparedStatement statement = con.prepareStatement(query)) {
            statement.setString(1, winner);
            int rowsAffected = statement.executeUpdate();

            if (rowsAffected == 0) {
                System.out.println("No player found with username " + winner);
            } else {
                System.out.println("Win updated successfully for player " + winner);
            }
        } catch (SQLException e) {
            System.out.println("Failed to update win in the database: " + e.getMessage());
        }
    }

    public static void updateHighestScore(Player[] players) {
        String selectQuery = "SELECT * FROM leaderboard";
        String insertQuery = "INSERT INTO leaderboard (username, score) VALUES (?,?)";
        String updateQuery = "UPDATE leaderboard SET score =? WHERE username =?";

        try (Statement statement = con.createStatement()) {
            ResultSet resultSet = statement.executeQuery(selectQuery);

            // Create a map to store the current leaderboard
            Map<String, Integer> leaderboard = new HashMap<>();
            while (resultSet.next()) {
                leaderboard.put(resultSet.getString("username"), resultSet.getInt("score"));
            }

            // Update the leaderboard for each player
            for (Player player : players) {
                if (leaderboard.containsKey(player.username)) {
                    // If the player is already in the leaderboard, update their score if it's higher
                    if (player.score > leaderboard.get(player.username)) {
                        try (PreparedStatement updateStmt = con.prepareStatement(updateQuery)) {
                            updateStmt.setInt(1, player.score);
                            updateStmt.setString(2, player.username);
                            updateStmt.executeUpdate();
                        }
                    }
                } else {
                    // If the player is not in the leaderboard, add them
                    try (PreparedStatement insertStmt = con.prepareStatement(insertQuery)) {
                        insertStmt.setString(1, player.username);
                        insertStmt.setInt(2, player.score);
                        insertStmt.executeUpdate();
                    }
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
