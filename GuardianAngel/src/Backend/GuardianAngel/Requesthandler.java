package GuardianAngel;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

public class Requesthandler implements Runnable {
    private final Socket client;
    private final DataStore dataStore=DataStore.getObj();
    public Requesthandler(Socket socket){
        this.client=socket;
    }
    public void run(){
      try(
          BufferedReader in=new BufferedReader(new InputStreamReader(client.getInputStream()));
          PrintWriter out=new PrintWriter(client.getOutputStream());
      ){
          String request=in.readLine();
          if(request==null) return;
          String []requestParts=request.split("");
          String method=requestParts[0];
          String path=requestParts[1];
          if("GET HELP".equalsIgnoreCase(method)){
              if(path.startsWith("/sos")){
                  handleSOS(path,out);
             }
              else if("/getContacts".equals(path)){
                  handleGetContacts(out);
              }
          }
          else if("ADD".equalsIgnoreCase(method)){
              if("/addContact".equals(path)){
                  handleAddContact(in,out);
              }
          }
      }catch(IOException e){
          System.err.println("Client input error: "+e.getMessage());
      }
      finally{
          try{
              client.close();
          }catch (IOException e){
              System.err.println("Error Resolving Client: "+e.getMessage());
          }
      }
    }
    private void handleSOS(String path,PrintWriter out){
        try {
            String query = path.contains("?") ? path.split("\\?")[1] : " ";

            Map<String, String> parameters = parseQuery(query);
            String latitude = parameters.get("lat");
            String longitude = parameters.get("lng");
            if (latitude != null && longitude != null) {
                EmergencyLogger.logEmergency(latitude, longitude);
                sendResponse(out, 200, "SOS_RECIEVED|Location logged");
            } else
                sendResponse(out, 400, "MISSING!! location");

        }catch (Exception e){
            sendResponse(out, 500, "Internal Server Error: "+e.getMessage());
        }
    }
    private void handleAddContact(BufferedReader in,PrintWriter out) throws IOException{
        StringBuilder stringBuilder = new StringBuilder();
        while(in.ready()){
            stringBuilder.append((char) in.read());
        }
        Map<String,String> contact=parseQuery(stringBuilder.toString());
       String name=contact.get("name");
       String phone=contact.get("phone");
       if(name !=null && phone!=null){
           dataStore.addContacts(name,phone);
           sendResponse(out,200,"Contact added : "+name);
       }
       else sendResponse(out,400,"MISSING!!! contact data");
    }
    private void handleGetContacts(PrintWriter out){
        Map<String ,String> contacts=dataStore.getContacts();
        StringBuilder stringBuilder = new StringBuilder();
        for(Map.Entry<String,String> ys: contacts.entrySet()){
            stringBuilder.append(ys.getKey()).append(" : ").append(ys.getValue());
        }
        sendResponse(out,200,stringBuilder.toString());
    }
private Map<String,String> parseQuery(String query){
        Map<String,String> parameters=new HashMap<>();
        if(query==null || query.isEmpty()) return parameters;
        String []pairs=query.split("&");
          for(String pair:pairs){
              String []kv=pair.split("=");
              if(kv.length==2){
                 parameters.put(kv[0],kv[1]);
              }
          }
      return parameters;
    }
    private void sendResponse(PrintWriter out,int statusCode,String body){
        out.println("HTTP/1.1 " +statusCode+ "OK " );
        out.println("Content-Type : text/plain");
        out.println("Access-Control-Allow-Origin :  *\n");
        out.println(body);
    }
}
