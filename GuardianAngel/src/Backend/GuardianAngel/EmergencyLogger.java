package GuardianAngel;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;

public class EmergencyLogger {
    private static final String LOG_FILE="emergencies.log";
    public static void logEmergency(String lat,String lng){
        String logEntry=new Date()+"  ,  "+lat+"  ,  "+lng;
        try(FileWriter fileWriter = new FileWriter(LOG_FILE);){
            fileWriter.write(logEntry);
        }catch (IOException e){
            System.out.println("Failed to log emergency : "+e.getMessage());
        }
}
}
