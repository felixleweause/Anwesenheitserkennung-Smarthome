import 'package:beta_app/Screen/home.dart';
import 'package:beta_app/api/bridge.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class bridge_connects extends StatefulWidget {
  @override
  _bridge_connectsState createState() => _bridge_connectsState();
}

class _bridge_connectsState extends State<bridge_connects> {
  TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Color.fromRGBO(0, 59, 54, 1),
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
                    icon: Icon(Icons.arrow_back_ios),
                    onPressed: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => HomeScreen()));
                    }),
                SizedBox(
                  width: 45,
                ),
                Text(
                  'Bridge einrichten',
                  style: TextStyle(fontSize: 25, color: Colors.white),
                ),
              ],
            ),
            SizedBox(
              height: 20,
            ),
            Container(
              height: 160,
              width: 160,
            ),
            SizedBox(
              height: 50,
            ),
            Container(
              height: 160,
              width: 300,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.all(Radius.circular(19)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 9,
                    spreadRadius: 2,
                    offset: Offset(4, 4),
                  )
                ],
                color: Colors.white,
              ),
              child: Column(
                children: [
                  SizedBox(
                    height: 20,
                  ),
                  Transform.scale(
                    scale: 0.94,
                    child: TextField(
                      controller: nameController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'IP Adresse',
                      ),
                      onChanged: (text) {
                        setState(() {
                          ip = text;
                          //you can access nameController in its scope to get
                          // the value of text entered as shown below
                          //UserName = nameController.text;
                        });
                      },
                    ),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  Button(
                    onPressed: () async {
                      SharedPreferences prefs =
                          await SharedPreferences.getInstance();
                      String rai = 'true';
                      check_bridge = prefs.setString('check_bridge', rai);
                      prefs.setString('check_ip', ip);
                      String data = 'true';
                      setState(() {
                        //bridge_status = Colors.green;
                      });
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => HomeScreen(value: data)));
                    },
                    color: Colors.white,
                    child: Text(
                      'Verbinden',
                      style: TextStyle(
                          color: Color.fromRGBO(0, 59, 54, 1), fontSize: 20),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
