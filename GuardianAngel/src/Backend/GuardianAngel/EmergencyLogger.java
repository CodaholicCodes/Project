package GuardianAngel;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class EmergencyLogger {

    private static final String LOG_FILE = "emergencies.log";

    public static void logEmergency(String lat, String lng) {
        boolean fileExists = new File(LOG_FILE).exists();

        try (FileWriter writer = new FileWriter(LOG_FILE, true)) {
            // Write header if file does not exist yet
            if (!fileExists) {
                writer.write("Date & Time,Latitude,Longitude\n");
            }

            String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
            String entry = String.format("%s,%s,%s\n", timestamp, lat, lng);
            writer.write(entry);
            writer.flush();

            System.out.println("📌 SOS Logged: " + entry.trim());
        } catch (IOException e) {
            System.err.println("❌ Failed to write SOS log: " + e.getMessage());
        }
    }
}


