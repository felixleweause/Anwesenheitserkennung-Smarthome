import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:beta_app/Screen/User_profile.dart';
import 'package:beta_app/api/beacon.dart';
import 'package:beta_app/logig/lade_logig.dart';
import 'package:beta_app/style.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:beta_app/appconfig.dart';
import 'package:beta_app/logig/home_logig.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:beta_app/api/ble.dart';

import '../appconfig.dart';

var check_bridge;
var bridge_widget;
var bridge_color;

class HomeScreen extends StatefulWidget {
  String value;
  HomeScreen({required this.value});
  @override
  _HomeScreenState createState() => _HomeScreenState(value);
}

class _HomeScreenState extends State<HomeScreen> {
  String value;
  _HomeScreenState(this.value);
  bool bridge_logtin = false;
  bool dialogOpened = true;
  String accessToken;
  bool timer_update = false;
  var ip; // änderung
  @override
  void initState() {
    configureAmplify();
    check();
    super.initState();
    print("test");
    startble();
    update();
    const oneSec = const Duration(seconds: 5);
    Timer.periodic(oneSec, (Timer timer) {
      if (timer_update) {
        print("cancel");
        timer.cancel();
      }
      print(
          "Repeat task every one second"); // This statement will be printed after every one second
      update();
    });
  }

  @override
  void deactivate() {
    print("disposed");
    timer_update = true;
    super.deactivate();
  }

  @override
  void dispose() {
    print("disposed");
    timer_update = true;
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
        child: Container(
      decoration: BoxDecoration(
        color: background,
      ),
      child: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(
              height: 50,
            ),
            Container(
              margin: EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.roofing,
                      color: bridge_color,
                    ),
                    onPressed: () async {
                      SharedPreferences prefs =
                          await SharedPreferences.getInstance();
                      ip = prefs.get('check_ip');
                      Object? value = prefs.get('check_bridge');
                      checks();
                      timer_update = true;
                      print('1');
                      //beacon();
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => bridge_widget));
                    },
                    iconSize: 34,
                  ),
                  Column(
                    children: [
                      Text(
                        'Beta42',
                        style: TextStyle(fontSize: 15, color: script),
                      ),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            color: red,
                          ),
                          Text(
                            'Location',
                            style: TextStyle(fontSize: 15, color: script),
                          ),
                        ],
                      ),
                    ],
                  ),
                  IconButton(
                    onPressed: () async {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => User_profile()));
                    },
                    icon: Icon(Icons.account_circle),
                    iconSize: 34,
                    color: red,
                  )
                ],
              ),
            ),
            SizedBox(
              height: 35,
            ),
            GestureDetector(
              child: ListView(
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                padding: const EdgeInsets.symmetric(horizontal: 41),
                children: user.map((user) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 42),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 11, vertical: 15),
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.deepPurple, Colors.red],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.all(Radius.circular(34)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.red.withOpacity(0.4),
                            blurRadius: 8,
                            spreadRadius: 2,
                            offset: Offset(4, 4),
                          )
                        ]),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            Icon(
                              Icons.accessibility_new,
                              color: Colors.white,
                              size: 24,
                            ),
                            SizedBox(
                              width: 10,
                              height: 40,
                            ),
                            Text(
                              user.name,
                              style:
                                  TextStyle(fontSize: 19, color: Colors.white),
                            ),
                          ],
                        ),
                        Row(
                          children: <Widget>[
                            SizedBox(
                              width: 70,
                            ),
                            Text(
                              'Raum :',
                              style:
                                  TextStyle(fontSize: 17, color: Colors.white),
                            ),
                            SizedBox(
                              width: 10,
                            ),
                            Text(
                              user.room,
                              style:
                                  TextStyle(fontSize: 19, color: Colors.white),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    ));
  }

  Future<void> checksss() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    Object? value = prefs.get('check_bridge');
    print(value);
    if (value == 'true') {
      bridge_color = Colors.green;
    } else {
      bridge_color = Colors.red;
    }
  }

  Future<void> sinOut() async {
    try {
      SignOutResult res = await Amplify.Auth.signOut();
    } catch (error) {
      print(error);
    }
  }

  Future<void> getupdatedata(accessToken, ip) async {
    print(accessToken);
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    String uri = 'http://' + ip + ':3000/api';
    final response_2 = await http.post(Uri(userInfo: uri),
        headers: headers, body: "token=" + accessToken + "&query=personsdata");
    print(response_2.body);
    var decoded = json.decode(response_2.body);
    print(decoded);
    user = [];
    decoded['results'].forEach((element) => setState(() {
          user.add(home_info("/", element['name'], element['state']));
        }));
  }

  Future<void> update() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    token_check()
        .whenComplete(() => getupdatedata(accessToken, prefs.get('check_ip')));
  }

  Future<void> token_check() async {
    final authState = await Amplify.Auth.fetchAuthSession(
            options: CognitoSessionOptions(getAWSCredentials: true))
        as CognitoAuthSession;
    if (authState.isSignedIn) {
      accessToken = authState.userPoolTokens!.idToken;
      print(accessToken);
    }
  }
}
