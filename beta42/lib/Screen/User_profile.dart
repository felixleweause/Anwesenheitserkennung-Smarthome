import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:beta_app/style.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class User_profile extends StatefulWidget {
  @override
  _User_profileState createState() => _User_profileState();
}

class _User_profileState extends State<User_profile> {
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
                      Navigator.pop(context);
                    })
              ],
            ),
            SizedBox(
              height: 50,
            ),
            Text(
              'Over View',
              style: TextStyle(color: Colors.white, fontSize: 29),
            ),
            SizedBox(
              height: 50,
            ),
            Row(
              children: [
                SizedBox(
                  width: 120,
                ),
                Column(
                  children: [
                    TextButton(onPressed: () {}, child: Text("Softwareupdate")),
                    SizedBox(
                      height: 15,
                    ),
                    TextButton(onPressed: () {}, child: Text("AGBs")),
                    SizedBox(
                      height: 15,
                    ),
                    TextButton(
                        onPressed: () {},
                        child: Text("Datenschutzrichtlinien")),
                    SizedBox(
                      height: 15,
                    ),
                    TextButton(onPressed: () {}, child: Text("Impressum")),
                    SizedBox(
                      height: 15,
                    ),
                    TextButton(onPressed: () {}, child: Text("Über Beat42")),
                  ],
                ),
              ],
            ),
            SizedBox(
              height: 150,
            ),
            Row(
              children: [
                SizedBox(
                  width: 290,
                ),
                FloatingActionButton(
                  onPressed: () async {
                    SharedPreferences prefs =
                        await SharedPreferences.getInstance();
                    prefs.setBool('email', false);
                    prefs.remove('check_bridge');
                    prefs.remove('Mac-Adress');
                    prefs.remove('Name');
                    prefs.remove('Id');
                    prefs.remove('Raum-Name');
                    sinOut();
                  },
                  child: Text("Abmelden"),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

Future<void> sinOut() async {
  try {
    SignOutResult res = await Amplify.Auth.signOut();
  } catch (error) {
    print(error);
  }
}
