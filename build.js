const { build } = require('electron-builder');

build({
    config: {
        appId: "votre.id.dapplication", // ID unique de votre application (ex: com.example.myapp)
        productName: "Hephai", // Nom de votre application
        copyright: "Copyright © 2024 Lucas Raffalli", // Copyright de votre application
        directories: {
            output: "dist" // Répertoire de sortie des fichiers de build
        },
        files: [
            "build/**/*", // Inclure tous les fichiers du répertoire de build
            "node_modules/**/*" // Inclure les dépendances Node.js
        ],
        win: {
            target: "nsis", // Utiliser NSIS comme installateur Windows
            icon: "assets/images/appIcon.ico", // Icône de l'installateur
            // Options supplémentaires pour NSIS :
            oneClick: false, // Désactiver l'installation en un clic
            allowToChangeInstallationDirectory: true, // Autoriser le changement du répertoire d'installation
            createDesktopShortcut: true, // Créer un raccourci sur le bureau
            createStartMenuShortcut: true, // Créer un raccourci dans le menu Démarrer
            // ... autres options NSIS ...
        },
        nsis: {
            oneClick: false, // Désactiver l'installation en un clic
            allowToChangeInstallationDirectory: true, // Autoriser le changement du répertoire d'installation
            // ... autres options NSIS ...
        },
        // Autres plateformes (si nécessaire) :
        mac: {
            target: "dmg", // Créer un fichier DMG pour macOS
            icon: "assets/images/appIcon.icns" // Icône pour macOS
        },
        linux: {
            target: ["AppImage", "deb", "rpm"], // Créer des packages AppImage, deb et rpm pour Linux
            icon: "assets/images/appIcon.png" // Icône pour Linux
        }
    }
}).then(() => {
    console.log('Build réussi !');
}).catch(err => {
    console.error('Erreur de build :', err);
});