<?php
require 'vendor/autoload.php'; // Make sure to include the Composer autoload file

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class FacilityTransactionServer implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $message = json_decode($msg, true);
        echo "OnMessage Run\n";
        if (isset($message['action']) && $message['action'] === 'update') {
            $dataToBroadcast = ['action' => 'update'];
            echo "Sent to clients\n";
            // Broadcast the new data to all clients
            foreach ($this->clients as $client) {
                if ($from !== $client) {
                    echo "Client sent!\n";
                    $client->send(json_encode($dataToBroadcast));
                }
            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}
echo "Server listening to port 8080\n";
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new FacilityTransactionServer()
        )
    ),
    8080
);
$server->run();