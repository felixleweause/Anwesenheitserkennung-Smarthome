import 'dart:html';

import 'package:beta_app/style.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class scannerScreen extends StatefulWidget {
  @override
  _scannerState createState() => _scannerState();
}

class _scannerState extends State<scannerScreen> {
  @override
  void initState() {
    super.initState();
  }

  bool nowlanchage = true;

  var new_Wlan_Name;
  var new_Wlan_Passwort;
  var new_raum;
  var new_raum_id;

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Container(
        color: background,
        child: Stack(
          children: [
            Positioned(
                top: 60,
                left: 110,
                child: Text(
                  'Gerät Hinzufügen',
                  style: TextStyle(fontSize: 24, color: script),
                )),
            Positioned(
                top: 50,
                left: 25,
                child: IconButton(
                  icon: Icon(
                    Icons.arrow_back_ios,
                    color: red,
                  ),
                  onPressed: () {
                    print(nowlanchage);
                    if (nowlanchage == true) {
                      Navigator.pop(context);
                    } else {
                      setState(() {
                        nowlanchage = true;
                      });
                    }
                  },
                )),
            Positioned(
              top: 250,
              left: 80,
              child: Column(
                children: [
                  AnimatedDefaultTextStyle(
                      child: nowlanchage
                          ? Container(
                              child: Text(
                                'Bitte öffne deine Wlan einstellungen. Wechsel in das Beta42-Scanner 1 Wlan',
                              ),
                              height: 200,
                              width: 250,
                            )
                          : Column(
                              children: [
                                Container(
                                  child: Text(
                                      'Trage hier bitte die Daten aus deinem Wlannetz ein '),
                                  height: 80,
                                  width: 250,
                                ),
                                SizedBox(
                                  width: 200,
                                  child: TextField(
                                    style: TextStyle(color: Colors.white),
                                    decoration: InputDecoration(
                                      labelText: "Wlan-Name",
                                      labelStyle: new TextStyle(color: red),
                                      fillColor: script,
                                      hintStyle: TextStyle(
                                        color: Colors.white,
                                      ),
                                    ),
                                    onChanged: (text) {
                                      setState(() {
                                        new_Wlan_Name = text;
                                      });
                                    },
                                  ),
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                SizedBox(
                                  width: 200,
                                  child: TextField(
                                      style: TextStyle(color: Colors.white),
                                      obscureText: true,
                                      decoration: InputDecoration(
                                        labelText: "Wlan-Passwort",
                                        labelStyle: new TextStyle(color: red),
                                        fillColor: script,
                                        hintStyle: TextStyle(
                                          color: Colors.white,
                                        ),
                                      ),
                                      onChanged: (text) {
                                        setState(() {
                                          new_Wlan_Passwort = text;
                                        });
                                      }),
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                SizedBox(
                                  width: 200,
                                  child: TextField(
                                      style: TextStyle(color: Colors.white),
                                      decoration: InputDecoration(
                                        labelText: "Raum",
                                        labelStyle: new TextStyle(color: red),
                                        fillColor: script,
                                        hintStyle: TextStyle(
                                          color: Colors.white,
                                        ),
                                      ),
                                      onChanged: (text) {
                                        setState(() {
                                          new_raum = text;
                                        });
                                      }),
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                SizedBox(
                                  width: 200,
                                  child: TextField(
                                      style: TextStyle(color: Colors.white),
                                      decoration: InputDecoration(
                                        labelText: "Raum ID",
                                        labelStyle: new TextStyle(color: red),
                                        fillColor: script,
                                        hintStyle: TextStyle(
                                          color: Colors.white,
                                        ),
                                      ),
                                      onChanged: (text) {
                                        setState(() {
                                          new_raum_id = text;
                                        });
                                      }),
                                ),
                              ],
                            ),
                      style: TextStyle(fontSize: 20, color: script),
                      duration: const Duration(milliseconds: 200)),
                ],
              ),
            ),
            Positioned(
                left: 130,
                bottom: 40,
                child: ElevatedButton(
                  child: Row(
                    children: [
                      SizedBox(
                        width: 20,
                      ),
                      Text('Weiter',
                          style: TextStyle(fontSize: 18, color: script)),
                      SizedBox(
                        width: 20,
                      )
                    ],
                  ),
                  onPressed: () {
                    print(nowlanchage);
                    if (nowlanchage == false) {
                      print('test');
                      Navigator.pop(context);
                    }
                    setState(() {
                      nowlanchage = false;
                    });
                  },
                )),
            Positioned(
                top: 120,
                left: 140,
                child: Image.asset(
                  "assets/images/mikrochip.png",
                  height: 100,
                  width: 100,
                )),
          ],
        ),
      ),
    );
  }
}

class ArrowIcons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Positioned(
      right: 8,
      bottom: 40,
      child: Column(
        children: [
          IconButton(
              icon: Icon(
                Icons.arrow_upward_outlined,
                color: Colors.black,
              ),
              onPressed: () {}),
          IconButton(
              icon: Icon(
                Icons.arrow_downward_outlined,
                color: Colors.black,
              ),
              onPressed: () {}),
        ],
      ),
    );
  }
}

class Plane extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: 40,
      top: 25,
      child: RotatedBox(
        quarterTurns: 2,
        child: Icon(
          Icons.airplanemode_active,
          size: 64,
          color: Colors.white,
        ),
      ),
    );
  }
}

class Line extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: 40.0 + 32,
      top: 40,
      bottom: 10,
      width: 1,
      child: Container(color: Colors.white.withOpacity(0.5)),
    );
  }
}

class Page extends StatefulWidget {
  final int number;
  final String question;
  final List<String> answers;
  

  const Page(
      {required Key key,
      required this.number,
      required this.question,
      required this.answers,
      })
      : super(key: key);
  @override
  _PageState createState() => _PageState();
}

class _PageState extends State<Page> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 32,
        ),
      ],
    );
  }
}
