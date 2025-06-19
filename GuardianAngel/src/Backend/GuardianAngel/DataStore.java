package GuardianAngel;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class DataStore {
    private static final DataStore obj=new DataStore();
    private final Map<String,String> contacts = new ConcurrentHashMap<>();
  private DataStore(){
        contacts.put("Police", "100");
        contacts.put("Ambulance", "102");
        contacts.put("Women Helpline","1091");

    }
    public static DataStore getObj(){
        return obj;
    }
    public void addContacts(String name,String phoneNo){
      contacts.put(name,phoneNo);

    }
    public Map<String,String> getContacts(){
      return Collections.unmodifiableMap(contacts);
    }
}
