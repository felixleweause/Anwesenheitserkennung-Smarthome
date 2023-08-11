import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify.dart';
import 'package:beta42/Screen/home.dart';
import 'package:beta42/Screen/lade.dart';
import 'package:beta42/amplifyconfiguration.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';


String data_c ;




Future<void> check () async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  bridge_status = prefs.getString('check_bridge');
  email_status = prefs.getBool('email');
  if(email_status == null) {
    email_status = false;
    print('gefunden');
  }

  if (bridge_status == 'true') {
    bridge_color = Colors.green;
    data_c = 'true';
    print('gree');
  }
  else {
    bridge_color = Colors.red;
  }
  print('hhhh');
  print(bridge_color);
}


void configureAmplify() async {

  try {

    Amplify.addPlugin(AmplifyAuthCognito());

    await Amplify.configure(amplifyconfig);
    amplifyConfigured = true;
    print(amplifyConfigured);
  } catch (e) {
    print(e);
  }
}