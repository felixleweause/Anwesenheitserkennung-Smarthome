import 'package:beta42/api/ble.dart';
import 'package:beta42/buttoms/addbutton.dart';
import 'package:beta42/Screen/home.dart';
import 'package:beta42/api/bridge.dart';
import 'package:beta42/appconfig.dart';
import 'package:beta42/logig/home_logig.dart';
import 'package:beta42/style.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class bridge_menu extends StatefulWidget {
  @override
  _bridge_menuState createState() => _bridge_menuState();
}

class _bridge_menuState extends State<bridge_menu> {
  @override
  void initState() {
    token_check().whenComplete(() => getscanner());
  }

  Future<void> getscanner() async {
    print(accessToken);
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    final response_2 = await http.post('http://' + check_ip + ':3000/api',
        headers: headers, body: "token=" + accessToken + "&query=get_scanner");
    print(response_2.body);
    var decoded = json.decode(response_2.body);
    print(decoded);
    scanner = [];
    decoded['results'].forEach((element) => setState(() {
          scanner.add(scanner_data(
              element['esp_id'], element['version'], element['name']));
        }));
  }

  Future<void> updatescanner() async {
    print(accessToken);
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    final response_2 = await http.post('http://' + check_ip + ':3000/api',
        headers: headers, body: "token=" + accessToken + "&query=get_scanner");
    print(response_2.body);
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: background,
      child: Container(
        child: Column(
          children: [
            SizedBox(
              height: 50,
            ),
            Row(
              children: [
                SizedBox(
                  width: 20,
                ),
                IconButton(
                    icon: Icon(
                      Icons.arrow_back_ios,
                      color: red,
                    ),
                    onPressed: () {
                      String data = 'true';
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => HomeScreen(
                                    value: data,
                                  )));
                    }),
                SizedBox(
                  width: 25,
                ),
                Text(
                  'Deine Beta42-Bridge ',
                  style: TextStyle(fontSize: 20, color: script),
                ),
                SizedBox(
                  width: 5,
                ),
                /*IconButton(icon: Icon(Icons.add,color: red,), onPressed: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => scannerScreen()));
                }),*/
                SizedBox(
                  width: 20,
                ),
                AddTodoButton(),
              ],
            ),
            SizedBox(
              height: 20,
            ),
            Text(
              id,
              style: TextStyle(color: script),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              check_ip,
              style: TextStyle(color: script),
            ),
            SizedBox(
              height: 25,
            ),
            Row(
              children: [
                SizedBox(
                  width: 20,
                ),
                Text(
                  'Deine Sensoren :',
                  style: TextStyle(color: script, fontSize: 20),
                ),
              ],
            ),
            SizedBox(
              height: 20,
            ),
            GestureDetector(
              child: ListView(
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                padding: const EdgeInsets.symmetric(horizontal: 41),
                children: scanner.map((scanner) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 42),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 11, vertical: 15),
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Color.fromRGBO(86, 66, 206, 1),
                            Color.fromRGBO(252, 75, 74, 1),
                          ],
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
                            SizedBox(
                              width: 20,
                              height: 40,
                            ),
                            Text(
                              'Id :',
                              style: TextStyle(fontSize: 17, color: script),
                            ),
                            SizedBox(
                              width: 8,
                              height: 40,
                            ),
                            Text(
                              scanner.Id,
                              style: TextStyle(fontSize: 19, color: script),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 20,
                              height: 40,
                            ),
                            Text(
                              'Raum :',
                              style: TextStyle(fontSize: 17, color: script),
                            ),
                            SizedBox(
                              width: 8,
                              height: 40,
                            ),
                            Text(
                              scanner.Raum,
                              style: TextStyle(fontSize: 19, color: script),
                            ),
                            SizedBox(
                              width: 25,
                            ),
                            IconButton(
                                icon: Icon(Icons.upgrade),
                                onPressed: () {
                                  // update button
                                }),
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
    );
  }
}
