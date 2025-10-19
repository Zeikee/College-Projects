package tables;

public class Leaderboard {

    private String username, score;

    public Leaderboard(String username, String score) {
        this.username = username;
        this.score = score;
    }

    public String getUsername() {
        return username;
    }

    public String getWords() {
        return score;
    }


}
