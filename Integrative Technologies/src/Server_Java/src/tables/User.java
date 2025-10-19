package tables;

import BoggledGame.Player;

public class User {
    private int wins;
    private String username, password;

    public User(String username, String password, int wins) {
        this.username = username;
        this.password = password;
        this.wins = wins;
    }

    public static Player getUsername(String username) {
        return null;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getWins() {
        return wins;
    }

    public boolean checkPassword(String password) {
        return this.password.equals(password);
    }
}

