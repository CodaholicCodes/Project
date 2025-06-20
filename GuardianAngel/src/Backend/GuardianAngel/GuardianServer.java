package GuardianAngel;

import java.io.IOException;

public class GuardianServer {
    public static void main(String[] args) {
        try {
            HttpServer server = new HttpServer(8080);
              Runtime.getRuntime().addShutdownHook(new Thread(server::stop));
            server.start();

        } catch (IOException e) {
            System.out.println("Failed to start the server "+e.getMessage());
        }
    }
}
