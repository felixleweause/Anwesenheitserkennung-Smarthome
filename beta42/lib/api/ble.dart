import 'dart:async';
import 'package:flutter/services.dart';

String id = 'id';

Future<void> startble() async {
  const platform = const MethodChannel('beta.flutter.dev/Bluetooth');
  try {
    final String result = await platform.invokeMethod('getuuid');
    id = result;
  } on PlatformException catch (e) {
    id = "Failure '${e.message}'.";
  }
}

Future<void> stoptble() async {
  const platform = const MethodChannel('beta.flutter.dev/Bluetooth');
  try {
    final String result = await platform.invokeMethod('Bluetoothoff');
    id = result;
  } on PlatformException catch (e) {
    id = "Failure '${e.message}'.";
  }
}
