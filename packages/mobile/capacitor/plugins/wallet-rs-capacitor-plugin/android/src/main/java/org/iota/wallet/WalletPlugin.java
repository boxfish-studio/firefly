package org.iota.wallet;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.iota.types.*;
import org.iota.types.exceptions.WalletException;
import org.iota.types.exceptions.InitializeWalletException;
import org.iota.types.ids.account.AccountIdentifier;
import org.iota.types.ids.account.AccountIndex;

import java.util.HashMap;

import org.iota.Wallet;
import org.iota.types.AccountHandle;
import org.iota.types.ClientConfig;
import org.iota.types.CoinType;
import org.iota.types.WalletConfig;
import org.iota.types.secret.MnemonicSecretManager;

@CapacitorPlugin(name = "WalletPlugin")
public class WalletPlugin extends Plugin {

    @Override
    public void load() {
        try {
            System.out.println("Creating wallet --->");
            Wallet wallet = new Wallet(new WalletConfig()
                .withClientOptions(new ClientConfig().withNodes("https://api.testnet.shimmer.network")).withStoragePath("/data/data/org.iota.wallet/")
                .withSecretManager(new MnemonicSecretManager("hidden enroll proud copper decide negative orient asset speed work dolphin atom unhappy game cannon scheme glow kid ring core name still twist actor"))
                .withCoinType(CoinType.Shimmer)
            );
            System.out.println("<--------------------");

            System.out.println("Create account --->");
            wallet.createAccount("Begoto");
            System.out.println("<--------------------");

            System.out.println("Print accounts --->");
            for(AccountHandle account : wallet.getAccounts()) {
                System.out.println("Account: " + account.getAlias());
            } 
            System.out.println("<--------------------");

            System.out.println("Print mnemonic --->");
            System.out.println(wallet.generateMnemonic());
            System.out.println("<--------------------");
        } catch(InitializeWalletException | WalletException e) {
            e.printStackTrace();
        }
    }
}