package tables;

public class Settings {
    int roundTime, waitingTime, roundWin;

    public Settings(int roundTime, int waitingTime, int roundWin) {
        this.roundTime = roundTime;
        this.waitingTime = waitingTime;
        this.roundWin = roundWin;
    }

    public int getRoundTime() {
        return roundTime;
    }

    public void setRoundTime(int roundTime) {
        this.roundTime = roundTime;
    }

    public int getWaitingTime() {
        return waitingTime;
    }

    public void setWaitingTime(int waitingTime) {
        this.waitingTime = waitingTime;
    }

    public int getRoundWin() {
        return roundWin;
    }

    public void setRoundWin(int roundWin) {
        this.roundWin = roundWin;
    }
}
