// Einzige Quelle der Versionsnummer – genutzt von der App (window) und vom Service Worker (importScripts).
// Bei jedem Deploy hochzählen: sonst bekommt der Offline-Cache keine neue Version.
self.APP_VERSION = '1.4.0';
