import BoggledGame.BoggledInterface;
import BoggledGame.BoggledInterfaceHelper;
import org.omg.CORBA.ORB;
import org.omg.CORBA.Object;
import org.omg.CosNaming.NameComponent;
import org.omg.CosNaming.NamingContextExt;
import org.omg.CosNaming.NamingContextExtHelper;
import org.omg.PortableServer.POA;
import org.omg.PortableServer.POAHelper;

import javax.swing.*;

public class BoggledServer {

    // This is the main method of the BoggledServer class, which is responsible for initializing and starting the server.
    public static void main(String[] args) {
        try {
            DataAccess.setCon();
            GUI gui = new GUI();
            // create and initialize the ORB
            ORB orb = ORB.init(args, null);
            // get reference to rootpoa &
            // activate the POAManager
            POA rootpoa = POAHelper.narrow(orb.resolve_initial_references("RootPOA"));
            rootpoa.the_POAManager().activate();

            // create servant and register it with the ORB
            BoggledServant serv = new BoggledServant();

            // get object reference from the servant
            Object ref = rootpoa.servant_to_reference(serv);
            BoggledInterface href = BoggledInterfaceHelper.narrow(ref);

            // get the root naming context
            Object objRef = orb.    resolve_initial_references("NameService");

            // Use NamingContextExt-which is part of the Interoperable Naming Service (INS) specification.
            NamingContextExt ncRef = NamingContextExtHelper.narrow(objRef);

            // bind the Object Reference in Naming
            String name = "Boggled";
            NameComponent[] path = ncRef.to_name(name);
            ncRef.rebind(path, href);


            System.out.println("BoggledServer ready and waiting ...");
            // wait for invocations from clients
            orb.run();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, "Error joining game" + e.getMessage());

        }

        System.out.println("Boggled Server Exiting");
    }

}

