package GuardianAngel;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HttpServer {
    private final int port;
    private ServerSocket socket;
    private ExecutorService service ;
    private boolean running;
    public HttpServer(int port)
    {
        this.port=port;
        this.service= Executors.newFixedThreadPool(10);

    }
    public void start()throws IOException {
        socket = new ServerSocket(port);
        running = true;
       while (running) {
            Socket client = socket.accept();
            service.submit(new Requesthandler(client));
        }
    }
    public void stop(){
        running=false;
        service.shutdown();
        try{
            socket.close();
        }catch (IOException e){
            System.out.println("Error Closing : "+e.getMessage());
        }
    }
}
