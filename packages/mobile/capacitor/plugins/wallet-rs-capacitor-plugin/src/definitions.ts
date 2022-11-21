
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WalletPluginTypes {
    backup(destination: string, password: string): Promise<void>
    bech32ToHex(bech32Address: string): Promise<string>
    changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void>
    clearStrongholdPassword(): Promise<void>
    destroy(): void
    
}
