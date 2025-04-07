// File generated manually.
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
            'DefaultFirebaseOptions not configured for macOS.');
      case TargetPlatform.windows:
        throw UnsupportedError(
            'DefaultFirebaseOptions not configured for Windows.');
      case TargetPlatform.linux:
        throw UnsupportedError(
            'DefaultFirebaseOptions not configured for Linux.');
      default:
        throw UnsupportedError(
            'DefaultFirebaseOptions not supported for this platform.');
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyBNN6QhXgwgzNYz_AGZUcVrXiasncbDu8w',
    appId: '1:791496585110:web:47552a9aa816925c66f7b7',
    messagingSenderId: '791496585110',
    projectId: 'car-go-cz-1-st-prod',
    authDomain: 'car-go-cz-1-st-prod.firebaseapp.com',
    storageBucket: 'car-go-cz-1-st-prod.firebasestorage.app',
    measurementId: 'G-ZBEKGLB6F9',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyAkf1mIOSh9ZAigJWMDI9GbZB7PQ7VKhsU',
    appId: '1:791496585110:android:0c156875f834264466f7b7',
    messagingSenderId: '791496585110',
    projectId: 'car-go-cz-1-st-prod',
    storageBucket: 'car-go-cz-1-st-prod.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyDEM-75GSgs632k8UFJVdpquD3DTc8gUM4',
    appId: '1:791496585110:ios:7f84e822ecc6d88466f7b7',
    messagingSenderId: '791496585110',
    projectId: 'car-go-cz-1-st-prod',
    storageBucket: 'car-go-cz-1-st-prod.firebasestorage.app',
    iosBundleId: 'cz.in.cargo',
  );
}
