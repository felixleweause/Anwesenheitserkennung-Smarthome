
import 'package:beta42/Screen/bridge_connect.dart';
import 'package:beta42/Screen/bridge_menu.dart';
import 'package:beta42/Screen/home.dart';
import 'package:beta42/api/bridge.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
var check_ip;

Future<void> check_store() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  check_bridge = prefs.getString('check_bridge');
  check_ip = prefs.getString('check_ip');
  print(check_bridge);
}

void checks() {
  check_store().whenComplete(() => {
    print('hallo'),
    if (check_bridge == 'true'){
      print(ip),
      bridge_widget = bridge_menu(),
      print('2'),
      bridge_color = Colors.green,
    }
    else {
      bridge_widget = bridge_connects(),
      print('3'),
      bridge_color = Colors.red,
    },
    if (check_ip != null) {
      bridge_widget =  bridge_menu(),
      print('22'),
      bridge_color = Colors.green,
      print(bridge_color),
    }
  });
}