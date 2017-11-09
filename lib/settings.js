import Dom from './dom'
import fs from 'fs'

export default {
    init(state) {
        this.themeSet = false;
        if (!this.isLoaded('seti-bloody-syntax')) {
            return
        }
        // ONCE PACKAGE IS LOADED
        // WHEN SYNTAX THEME CHANGES
        atom.config.onDidChange('seti-bloody-syntax.themeColor', (value) => {
            this.setTheme(value.newValue, value.oldValue, true);
        });
        // WHEN DYNAMIC THEME IS ENABLED OR DISABLED
        atom.config.onDidChange('seti-bloody-syntax.dynamicColor', (value) => {
            let newColor;
            // IF DYNIMIC IS ALLWOED
            if (value.newValue) {
                newColor = atom.config.get('seti-bloody-ui.themeColor');
                this.setTheme(newColor, false, true);
            } else {
                // IF SYNTAX COLOR HAS BEEN SET
                // IF DYNAMIC IS NOT ALLOWED
                if (atom.config.get('seti-bloody-syntax.themeColor')) {
                    newColor = atom.config.get('seti-bloody-syntax.themeColor');
                } else {
                    // FALLBACK TP DEFAULT COLO IF NONE SET
                    newColor = 'default';
                }
                this.setTheme(newColor, false, true);
            }
        });
        if (!this.isLoaded('seti-bloody-ui')) {
            return
        }
        // IF SETI UI IS LOADED
        // IF DYNAMIC THEM IS ALLOWED
        if (atom.config.get('seti-bloody-syntax.dynamicColor') && !this.themeSet) {
            // SET SYNTAX THEME TO MATCH UI
            this.setTheme(atom.config.get('seti-bloody-ui.themeColor'), false, false);
        }
        // WHEN UI THEME CHANGES
        atom.config.onDidChange('seti-bloody-ui.themeColor', (value) => {
            // IF DYNAMIC THEM IS ALLOWED
            if (atom.config.get('seti-bloody-syntax.dynamicColor')) {
                // SET SYNTAX THEME TO MATCH UI
                this.setTheme(value.newValue, value.oldValue, false);
            }
        });
        // IF SETI UI IS DEACTIVATED
        this.onDeactivate('seti-bloody-ui', () => {
            // IF DYNAMIC THEM WAS ALLOWED
            if (atom.config.get('seti-bloody-syntax.dynamicColor')) {
                // SET THEME TO DEFAULT
                this.setTheme('default', false, false);
            }
        });

        // SET USER THEME IS NOT SET DYNAMICALLY
        if ((atom.config.get('seti-bloody-syntax.themeColor')) && !this.themeSet) {
            this.setTheme(atom.config.get('seti-bloody-syntax.themeColor'), false, false);
        // IF ALL ELSE HAS FAILED, LOAD THE DEFAULT THEME
        } else if (!this.themeSet) {
            this.setTheme('default', false, false);
        }
    },
    // CHECKS IF A PACKAGE IS LOADED
    isLoaded(which) {
        return atom.packages.isPackageLoaded(which);
    },
    // WHEN PACKAGE ACTIVATES
    onActivate(which, cb) {
        atom.packages.onDidActivatePackage((pkg) => {
            if (pkg.name === which) {
                return cb(pkg);
            }
        });
    },
    // WHEN PACKAGE DEACTIVATES
    onDeactivate(which, cb) {
        return atom.packages.onDidDeactivatePackage((pkg) => {
            if (pkg.name === which) {
                return cb(pkg);
            }
        });
    },
    // GET INFO ABOUT OUR PACKAGE
    package: atom.packages.getLoadedPackage('seti-bloody-syntax'),
    // DETERMINE IF A SPECIFIC PACKAGE HAS BEEN LOADED
    packageInfo(which) {
        return atom.packages.getLoadedPackage(which);
    },
    // RELOAD WHEN SETTINGS CHANGE
    refresh() {
        this.package.deactivate();
        return setImmediate(() => {
            return this.package.activate();
        });
    },
    setTheme(theme, previous, reload) {
        const pkg = this.package;
        const themeData = '@import "themes/' + theme.toLowerCase() + '";';
        // THIS PREVENTS THEME FROM BEING SET TWICE
        this.themeSet = true;
        // CHECK CURRENT THEME FILE
        const filepath2Read = pkg.path + '/styles/user-theme.less'
        fs.readFile(filepath2Read, 'utf8', (err, fileData) => {
            // IF THEME IS DIFFERENT THAN IS USED TO BE
            if (fileData !== themeData) {
                // SAVE A NEW USER THEME FILE
                const filepath2Write = pkg.path + '/styles/user-theme.less'
                return fs.writeFile(filepath2Write, themeData, (err) => {
                    if (!err) {
                        // RELOAD THE VIEW
                        return this.refresh();
                    }
                });
            }
        });
    }
};
