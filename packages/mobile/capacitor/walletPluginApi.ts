import { AccountManagerOptions, AccountSyncOptions, ClientOptions, CreateAccountPayload, EventType, LedgerNanoStatus, NodeInfoWrapper, WalletEvent } from '@iota/wallet'
import { IAccount } from '@core/account'
import { IApi, IProfileManager, RecoverAccountsPayload, WalletApiEventHandler } from '@core/profile-manager'
import { IAuth } from '@core/network';
import { registerPlugin } from '@capacitor/core';

interface WalletPluginTypes {

    // IApi
    createAccountManager(options: { id: string, options: AccountManagerOptions }): void;
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    deleteAccountManager(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    recoverAccounts(profileManagerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]>

    // IProfileManager
    backup(managerId: string, destination: string, password: string): Promise<void>
    bech32ToHex(managerId: string, bech32Address: string): Promise<string>
    changeStrongholdPassword(managerId: string, currentPassword: string, newPassword: string): Promise<void>
    clearStrongholdPassword(managerId: string): Promise<void>
    destroy(managerId: string): void
    emitTestEvent(managerId: string, event: WalletEvent): Promise<void>
    generateMnemonic(managerId: string): Promise<string>
    getAccountIndexes(managerId: string): Promise<number[]>
    getNodeInfo(managerId: string, url?: string, auth?: IAuth): Promise<NodeInfoWrapper>
    getLedgerNanoStatus(managerId: string): Promise<LedgerNanoStatus>
    hexToBech32(managerId: string, hex: string, bech32Hrp?: string): Promise<string>
    isStrongholdPasswordAvailable(managerId: string): Promise<boolean>
    listen(managerId: string, eventTypes: EventType[], callback: WalletApiEventHandler): void
    clearListeners(managerId: string, eventTypes: EventType[]): void
    removeLatestAccount(managerId: string): Promise<void>
    restoreBackup(managerId: string, source: string, password: string): Promise<void>
    setClientOptions(managerId: string, options: ClientOptions): Promise<void>
    setStrongholdPassword(managerId: string, password: string): Promise<void>
    setStrongholdPasswordClearInterval(managerId: string, intervalInMilliseconds?: number): Promise<void>
    startBackgroundSync(managerId: string, options?: AccountSyncOptions, intervalInMilliseconds?: number): Promise<void>
    stopBackgroundSync(managerId: string): Promise<void>
    storeMnemonic(managerId: string, mnemonic: string): Promise<void>
    verifyMnemonic(options: {managerId: string, mnemonic: string}): Promise<void>
}

const WalletPlugin = registerPlugin<WalletPluginTypes>('WalletPlugin');

(window as any).wallet = WalletPlugin;

const profileManagers = {}

class WrappedManager implements IProfileManager {
    id: string;
    backup(destination: string, password: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    bech32ToHex(bech32Address: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    clearStrongholdPassword(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    destroy(): void {
        throw new Error('Method not implemented.');
    }
    emitTestEvent(event: WalletEvent): Promise<void> {
        throw new Error('Method not implemented.');
    }
    generateMnemonic(): Promise<string> {
        throw new Error('Method not implemented.');
    }
    getAccountIndexes(): Promise<number[]> {
        throw new Error('Method not implemented.');
    }
    getAccount(accountIndex: number): Promise<IAccount> {
        throw new Error('Method not implemented.');
    }
    getAccounts(): Promise<IAccount[]> {
        throw new Error('Method not implemented.');
    }
    getNodeInfo(url?: string, auth?: IAuth): Promise<NodeInfoWrapper> {
        throw new Error('Method not implemented.');
    }
    getLedgerNanoStatus(): Promise<LedgerNanoStatus> {
        throw new Error('Method not implemented.');
    }
    hexToBech32(hex: string, bech32Hrp?: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
    isStrongholdPasswordAvailable(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    listen(eventTypes: EventType[], callback: WalletApiEventHandler): void {
        throw new Error('Method not implemented.');
    }
    clearListeners(eventTypes: EventType[]): void {
        throw new Error('Method not implemented.');
    }
    removeLatestAccount(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    restoreBackup(source: string, password: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    setClientOptions(options: ClientOptions): Promise<void> {
        throw new Error('Method not implemented.');
    }
    setStrongholdPassword(password: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    setStrongholdPasswordClearInterval(intervalInMilliseconds?: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    startBackgroundSync(options?: AccountSyncOptions, intervalInMilliseconds?: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    stopBackgroundSync(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    storeMnemonic(mnemonic: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    verifyMnemonic(mnemonic: string): Promise<void> {
        return WalletPlugin.verifyMnemonic({
            managerId: this.id,
            mnemonic
        });
    }
}


export const WalletBindings: IApi = {
    createAccountManager: (id: string, options: AccountManagerOptions): IProfileManager => {
        WalletPlugin.createAccountManager({ id, options });

        const manager = new WrappedManager();
        manager.id = id
        profileManagers[id] = manager

        return manager
    },
    createAccount: async (managerId: string, payload: CreateAccountPayload): Promise<IAccount> => {
        const manager = profileManagers[managerId]
        const account = await manager.createAccount(payload)
        return account
    },
    deleteAccountManager: (id: string): void => {
        if (id && id in profileManagers) {
            delete profileManagers[id]
        }
    },
    getAccount: async (managerId: string, index: number): Promise<IAccount> => {
        const manager = profileManagers[managerId]
        const account = await manager.getAccount(index)
        return account
    },
    getAccounts: async (managerId: string): Promise<IAccount[]> => {
        const manager = profileManagers[managerId]
        const accounts = await manager.getAccounts()
        return accounts
    },
    recoverAccounts: async (managerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]> => {
        const manager = profileManagers[managerId]
        const accounts = await manager.recoverAccounts(...Object.values(payload))
        return accounts
    },
}

// window.wallet.createAccount().then(r => console.log(r))