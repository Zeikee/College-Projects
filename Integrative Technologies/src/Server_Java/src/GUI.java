import tables.Settings;
import tables.User;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.plaf.basic.BasicButtonUI;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class GUI extends JFrame {
    private JTable table;
    private DefaultTableModel model;
    private JTextField searchField;

    public GUI() {
        super("Boggled Game");
        setSize(500, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setVisible(true);
        setLocationRelativeTo(null);
        setContentPane(contentPane());
    }

    public JPanel contentPane() {
        JPanel contentPane = new JPanel(new BorderLayout(5, 5));
        contentPane.setBorder(new EmptyBorder(10, 10, 10, 10));
        JPanel buttonPanel = buttonPanel();
        contentPane.add(buttonPanel, BorderLayout.CENTER);
        setContentPane(contentPane);
        return contentPane;
    }

    public JPanel buttonPanel() {
        JPanel buttonPanel = new JPanel(new GridBagLayout());
        buttonPanel.setPreferredSize(new Dimension(300, 300));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(5, 5, 5, 5);
        JButton players = new JButton("Players");
        JButton settings = new JButton("Settings");
        JButton close = new JButton("Exit");
        Dimension buttonSize = new Dimension(100, 50);
        players.setBackground(new Color(2, 117, 216));
        settings.setBackground(new Color(240, 173, 78));
        close.setBackground(new Color(217, 83, 79));
        players.setPreferredSize(buttonSize);
        settings.setPreferredSize(buttonSize);
        close.setPreferredSize(buttonSize);
        players.setUI(new StyledButtonUI());
        settings.setUI(new StyledButtonUI());
        close.setUI(new StyledButtonUI());

        players.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showPlayersPanel();
            }
        });

        settings.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showSettingsPanel();
            }
        });

        close.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                System.exit(0);
            }
        });

        buttonPanel.add(players, gbc);
        gbc.gridy++;
        buttonPanel.add(settings, gbc);
        gbc.gridy++;
        buttonPanel.add(close, gbc);
        return buttonPanel;
    }

    private void showPlayersPanel() {
        JPanel playersPanel = new JPanel(new BorderLayout());
        table = new JTable();

        String[] columnNames = {"Username", "Password", "Wins"};
        model = new DefaultTableModel(columnNames, 0);
        refreshTable();

        JScrollPane scrollPane = new JScrollPane(table);
        playersPanel.add(scrollPane, BorderLayout.CENTER);

        JPanel buttonPanel = new JPanel(new FlowLayout());
        JButton addButton = new JButton("Add");
        addButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                addRow();
            }
        });
        JButton editButton = new JButton("Edit");
        editButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                editRow();
            }
        });
        JButton deleteButton = new JButton("Delete");
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                deleteRow();
            }
        });

        searchField = new JTextField(20);
        searchField.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                searchUser(searchField.getText());
            }
        });

        buttonPanel.add(new JLabel("Search:"));
        buttonPanel.add(searchField);
        buttonPanel.add(addButton);
        buttonPanel.add(editButton);
        buttonPanel.add(deleteButton);
        playersPanel.add(buttonPanel, BorderLayout.SOUTH);

        JDialog dialog = new JDialog(this, "Players", true);
        dialog.getContentPane().add(playersPanel);
        dialog.pack();
        dialog.setLocationRelativeTo(this);
        dialog.setVisible(true);
    }

    private void refreshTable() {
        model.setRowCount(0);
        ArrayList<User> users = DataAccess.getUsers();
        for (User user : users) {
            model.addRow(new Object[]{user.getUsername(), user.getPassword(), user.getWins()});
        }
        table.setModel(model);
    }

    private void addRow() {
        JTextField usernameField = new JTextField(10);
        JTextField passwordField = new JTextField(10);
        JPanel inputPanel = new JPanel(new GridLayout(0, 2));
        inputPanel.add(new JLabel("Username:"));
        inputPanel.add(usernameField);
        inputPanel.add(new JLabel("Password:"));
        inputPanel.add(passwordField);

        int result = JOptionPane.showConfirmDialog(null, inputPanel, "Enter User Details", JOptionPane.OK_CANCEL_OPTION);
        if (result == JOptionPane.OK_OPTION) {
            try {
                String username = usernameField.getText().trim();
                String password = passwordField.getText().trim();

                if (username.isEmpty()) {
                    throw new IllegalArgumentException("Username cannot be empty");
                }

                if (password.isEmpty()) {
                    throw new IllegalArgumentException("Password cannot be empty");
                }

                int wins = 0; // Default value for wins

                model.addRow(new Object[]{username, password, wins});
                User user = new User(username, password, wins);
                DataAccess.addUser(user);
            } catch (IllegalArgumentException e) {
                JOptionPane.showMessageDialog(null, e.getMessage(), "Input Error", JOptionPane.ERROR_MESSAGE);
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Error adding user: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void editRow() {
        int selectedRow = table.getSelectedRow();
        try {
            if (selectedRow != -1) {
                String username = (String) table.getValueAt(selectedRow, 0);
                String password = (String) table.getValueAt(selectedRow, 1);
              //  int wins = (int) table.getValueAt(selectedRow, 2);
                DataAccess.editUser(username, password);
                refreshTable();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error editing user: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteRow() {
        int selectedRow = table.getSelectedRow();
        try {
            if (selectedRow != -1) {
                String username = (String) table.getValueAt(selectedRow, 0);
                DataAccess.deleteUser(username);
                refreshTable();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error deleting user: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void showSettingsPanel() {
        JPanel settingsPanel = new JPanel(new GridLayout(0, 2));
        JTextField roundTimeField = new JTextField(10);
        JTextField waitingTimeField = new JTextField(10);
        JTextField roundWinField = new JTextField(10);
        Settings settings = DataAccess.getSettings();
        roundTimeField.setText(String.valueOf(settings.getRoundTime()));
        waitingTimeField.setText(String.valueOf(settings.getWaitingTime()));
        roundWinField.setText(String.valueOf(settings.getRoundWin()));
        settingsPanel.add(new JLabel("Round Time:"));
        settingsPanel.add(roundTimeField);
        settingsPanel.add(new JLabel("Waiting Time:"));
        settingsPanel.add(waitingTimeField);
        settingsPanel.add(new JLabel("Round Win:"));
        settingsPanel.add(roundWinField);
        int result = JOptionPane.showConfirmDialog(null, settingsPanel, "Settings", JOptionPane.OK_CANCEL_OPTION);
        if (result == JOptionPane.OK_OPTION) {
            try {
                int roundTime = Integer.parseInt(roundTimeField.getText());
                int waitingTime = Integer.parseInt(waitingTimeField.getText());
                int roundWin = Integer.parseInt(roundWinField.getText());
                DataAccess.setSettings(new Settings(roundTime, waitingTime, roundWin));
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(null, "All fields must be numbers", "Input Error", JOptionPane.ERROR_MESSAGE);
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Error saving settings: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void searchUser(String username) {
        TableRowSorter<DefaultTableModel> sorter = new TableRowSorter<>(model);
        table.setRowSorter(sorter);
        if (username.length() == 0) {
            sorter.setRowFilter(null);
        } else {
            sorter.setRowFilter(RowFilter.regexFilter("(?i)" + username));
        }
    }

    public static void main(String[] args) {
        new GUI();
    }
}

class   StyledButtonUI extends BasicButtonUI {

    @Override
    public void installUI(JComponent c) {
        super.installUI(c);
        AbstractButton button = (AbstractButton) c;
        button.setOpaque(false);
        button.setBorder(new EmptyBorder(5, 15, 5, 15));
    }

    @Override
    public void paint(Graphics g, JComponent c) {
        AbstractButton b = (AbstractButton) c;
        paintBackground(g, b, b.getModel().isPressed() ? 2 : 0);
        super.paint(g, c);
    }

    private void paintBackground(Graphics g, JComponent c, int yOffset) {
        Dimension size = c.getSize();
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        if (c instanceof JToggleButton) {
            yOffset += 2;
        }
        g.setColor(c.getBackground().darker());
        g.fillRoundRect(0, yOffset, size.width, size.height - yOffset, 10, 10);
        g.setColor(c.getBackground());
        g.fillRoundRect(0, yOffset, size.width, size.height + yOffset - 5, 10, 10);
    }
}
