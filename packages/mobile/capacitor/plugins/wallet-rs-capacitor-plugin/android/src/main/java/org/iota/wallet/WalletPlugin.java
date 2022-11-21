package org.iota.wallet;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.iota.types.*;
import org.iota.types.exceptions.WalletException;
import org.iota.types.ids.account.AccountIdentifier;
import org.iota.types.ids.account.AccountIndex;

import java.util.HashMap;

import org.iota.Wallet;
import org.iota.types.AccountHandle;
import org.iota.types.ClientConfig;
import org.iota.types.CoinType;
import org.iota.types.WalletConfig;
import org.iota.types.secret.StrongholdSecretManager;

import org.json.JSONException;

@CapacitorPlugin(name = "WalletPlugin")
public class WalletPlugin extends Plugin {

    private static final String DEFAULT_DEVELOPMENT_MNEMONIC = "hidden enroll proud copper decide negative orient asset speed work dolphin atom unhappy game cannon scheme glow kid ring core name still twist actor";

    private HashMap<String, Wallet> wallets = new HashMap();

    @PluginMethod
    public void createAccountManager(PluginCall call) {
        String managerId = call.getString("managerId");

        WalletConfig config = new WalletConfig();
        Wallet manager = new Wallet(config);

        this.wallets.insert(managerId, manager);
        System.out.println(manager);

        call.resolve();
    }

    @PluginMethod
    public void createAccount(PluginCall call) throws WalletException {
        // Build the wallet.
        Wallet wallet = new Wallet(new WalletConfig()
                .withClientOptions(new ClientConfig().withNodes("https://api.testnet.shimmer.network"))
                .withSecretManager(new StrongholdSecretManager("PASSWORD_FOR_ENCRYPTION", null, "example-wallet"))
                .withCoinType(CoinType.Shimmer)
        );
        wallet.storeMnemonic(DEFAULT_DEVELOPMENT_MNEMONIC);

        // Create an account.
        AccountHandle a = wallet.createAccount("Alice");

        // Print the account.
        System.out.println(a);

        System.out.println(a);
        call.resolve();
    }

    @PluginMethod
    public void verifyMnemonic(PluginCall call) {
        String managerId = call.getString("managerId");
        String mnemonic = call.getString("mnemonic");
        
        Wallet manager = this.wallets.get(managerId);

        manager.verifyMnemonic(mnemonic);
    }
}
