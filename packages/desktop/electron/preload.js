const fs = require('fs')
const binding = require('wallet-nodejs-binding')
const PincodeManager = require('./lib/pincodeManager')
const DeepLinkManager = require('./lib/deepLinkManager')
const NotificationManager = require('./lib/notificationManager')
const { ipcRenderer, contextBridge } = require('electron')
const { proxyApi } = require('../../shared/lib/walletApi')
const { menuState } = require('./lib/menuState')
const kdbx = require('./lib/kdbx')

let activeProfileId = null

const Wallet = binding
Wallet.api = proxyApi(() => activeProfileId)

const eventListeners = {}

const Electron = {
    updateActiveProfile(id) {
        activeProfileId = id
    },
    PincodeManager,
    DeepLinkManager,
    NotificationManager,
    getStrongholdBackupDestination: (defaultPath) => {
        return ipcRenderer.invoke('show-save-dialog', { properties: ['createDirectory', 'showOverwriteConfirmation'], defaultPath }).then((result) => {
            if (result.canceled) {
                return null
            }

            return result.filePath
        })
    },

    exportMigrationLog: (sourcePath, defaultFileName) => {
        return ipcRenderer.invoke('show-save-dialog', { properties: ['createDirectory', 'showOverwriteConfirmation'], defaultPath: defaultFileName }).then((result) => {
            if (result.canceled) {
                return null
            }

            return new Promise((resolve, reject) => {
                fs.copyFile(sourcePath, result.filePath, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                });
            })

        })
    },

    /**
     * Imports legacy IOTA seed
     * 
     * @method importLegacySeed
     * 
     * @param {Buffer} buffer 
     * @param {string} password 
     * 
     * @returns {Promise<string>} 
     */
    importLegacySeed: (buffer, password) => {
        return kdbx.importVault(buffer, password);
    },

    /**
     * Validates Seed Vault
     * 
     * 
     * @method validateSeedVault
     * 
     * @param {Buffer} buffer 
     * 
     * @returns {boolean} 
     */
    validateSeedVault: (buffer) => {
        return kdbx.checkFormat(buffer);
    },


    /**
     * Gets directory for app's configuration files
     *
     * @method getUserDataPath
     *
     * @returns {Promise}
     */
    getUserDataPath: () => ipcRenderer.invoke('get-path', 'userData'),
    /**
     * Gets diagnostics information for the system
     *
     * @method getDiagnostics
     *
     * @returns {Promise}
     */
    getDiagnostics: () => ipcRenderer.invoke('diagnostics'),
    /**
    * Starts an update of the application
    *
    * @method updateDownload
    *
    * @returns void
    */
    updateDownload: () => ipcRenderer.invoke('update-download'),
    /**
     * Cancels an update of the application
     *
     * @method updateCancel
     *
     * @returns void
     */
    updateCancel: () => ipcRenderer.invoke('update-cancel'),
    /**
     * Install an update of the application
     *
     * @method updateInstall
     *
     * @returns void
     */
    updateInstall: () => ipcRenderer.invoke('update-install'),
    /**
     * Get version details
     *
     * @method getVersionDetails
     *
     * @returns void
     */
    getVersionDetails: () => ipcRenderer.invoke('update-get-version-details'),
    /**
     * Change menu state to determine what menu items to display
     * @param {string} Attribute - Target attribute
     * @param {any} Value - Target attribute value
     * @returns {undefined}
     */
    updateMenu: (attribute, value) => {
        if (Object.keys(menuState).includes(attribute)) {
            ipcRenderer.invoke('menu-update', {
                [attribute]: value
            })
        }
    },
    /**
     * Add native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    onEvent: (event, callback) => {
        let listeners = eventListeners[event]
        if (!listeners) {
            listeners = eventListeners[event] = []
            ipcRenderer.on(event, (e, args) => {
                listeners.forEach((call) => {
                    call(args)
                })
            })
        }
        listeners.push(callback)
    },
}

contextBridge.exposeInMainWorld('__WALLET_INIT__', {
    run: Wallet.init,
})

contextBridge.exposeInMainWorld('__WALLET_API__', Wallet.api)

contextBridge.exposeInMainWorld('Electron', Electron)
