import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:beta_app/Animation/FadeAnimation.dart';
import 'package:beta_app/Screen/home.dart';
import 'package:beta_app/amplifyconfiguration.dart';
import 'package:beta_app/api/bridge.dart';
import 'package:beta_app/style.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

class login extends StatefulWidget {
  @override
  _loginState createState() => _loginState();
}

class _loginState extends State<login> {
  bool amplifyConfigured = false;
  bool isSignUpComplete = false;
  bool isSignedIN = false;
  bool safed = false;
  late String acces_token_login;
  var email;
  var pass;
  TextEditingController emailController = TextEditingController();
  TextEditingController passController = TextEditingController();

  @override
  void initState() {
    super.initState();
    configureAmplify();
  }

  void _recordEvent() async {}

  void  _registerUser() async {
    try {
      Map<String, dynamic> userAttributes = {"email": email};
      //name, passwort
      SignUpResult res = await Amplify.Auth.signUp(
          username: email,
          password: pass,
          options: CognitoSignUpOptions(userAttributes: {"email": email} ));
      setState(() {
        isSignUpComplete = res.isSignUpComplete;

        print("Sign up" + (isSignUpComplete ? "Complete" : "Not Complete"));
      });
    } catch (e) {
      
    }
  }

  Future<void> token_check_() async {
    final authState = await Amplify.Auth.fetchAuthSession(
            options: CognitoSessionOptions(getAWSCredentials: true))
        as CognitoAuthSession;
    if (authState.isSignedIn) {
      acces_token_login = authState.userPoolTokens!.idToken;
      print(acces_token_login);
    }
  }

  Future<void> getip() async {
    print(acces_token_login);
    const headers = {'Content-Type': 'application/json'};
    final response_2 = await http.post(
        'https://efkf4544y5.execute-api.eu-west-1.amazonaws.com/beta/ip',
        headers: headers,
        body: json.encode({"username": email, "idtoken": acces_token_login}));
    var decoded = json.decode(response_2.body);
    print(decoded);
    print(decoded['ip']);
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString("check_ip", decoded['ip']);
    prefs.setString('check_bridge', 'true');
    ip = decoded['ip'];
  }

  Future<String> _signIN() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    try {
      SignInResult res =
          await Amplify.Auth.signIn(username: email, password: pass);

      setState(() {
        isSignedIN = res.isSignedIn;
      });

      if (isSignedIN) print("verbunden");
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setBool('email', true);
      token_check_().whenComplete(() => getip());

      setState(() {});
      Navigator.push(
          context, MaterialPageRoute(builder: (context) => HomeScreen()));
    } catch (e) {
      return e.toString();
    }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: background,
        body: SingleChildScrollView(
          child: Container(
            child: Column(
              children: <Widget>[
                Container(
                  height: 400,
                  decoration: BoxDecoration(
                      image: DecorationImage(
                          image: AssetImage('assets/images/background.png'),
                          fit: BoxFit.fill)),
                  child: Stack(
                    children: <Widget>[
                      Positioned(
                        left: 30,
                        width: 80,
                        height: 200,
                        child: FadeAnimation(
                            1,
                            Container(
                              decoration: BoxDecoration(
                                  image: DecorationImage(
                                      image: AssetImage(
                                          'assets/images/light-1.png'))),
                            )),
                      ),
                      Positioned(
                        left: 140,
                        width: 80,
                        height: 150,
                        child: FadeAnimation(
                            1.3,
                            Container(
                              decoration: BoxDecoration(
                                  image: DecorationImage(
                                      image: AssetImage(
                                          'assets/images/light-2.png'))),
                            )),
                      ),
                      Positioned(
                        right: 40,
                        top: 40,
                        width: 80,
                        height: 150,
                        child: FadeAnimation(
                            1.5,
                            Container(
                              decoration: BoxDecoration(
                                  image: DecorationImage(
                                      image: AssetImage(
                                          'assets/images/clock.png'))),
                            )),
                      ),
                      Positioned(
                        child: FadeAnimation(
                            1.6,
                            Container(
                              margin: EdgeInsets.only(top: 50),
                              child: Center(
                                child: Text(
                                  "Login",
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 40,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                            )),
                      )
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(30.0),
                  child: Column(
                    children: <Widget>[
                      FadeAnimation(
                          1.8,
                          Container(
                            padding: EdgeInsets.all(5),
                            decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: [
                                  BoxShadow(
                                      color: Color.fromRGBO(143, 148, 251, .2),
                                      blurRadius: 20.0,
                                      offset: Offset(0, 10))
                                ]),
                            child: Column(
                              children: <Widget>[
                                Container(
                                  padding: EdgeInsets.all(8.0),
                                  decoration: BoxDecoration(
                                      border: Border(
                                          bottom: BorderSide(
                                              color: Colors.grey[100]))),
                                  child: TextField(
                                    controller: emailController,
                                    decoration: InputDecoration(
                                        border: InputBorder.none,
                                        hintText: "Email or Phone number",
                                        hintStyle:
                                            TextStyle(color: Colors.grey[400])),
                                    onChanged: (text) {
                                      setState(() {
                                        email = text;
                                      });
                                    },
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.all(8.0),
                                  child: TextField(
                                    obscureText: true,
                                    decoration: InputDecoration(
                                        border: InputBorder.none,
                                        hintText: "Password",
                                        hintStyle:
                                            TextStyle(color: Colors.grey[400])),
                                    onChanged: (text) {
                                      setState(() {
                                        pass = text;
                                      });
                                    },
                                  ),
                                )
                              ],
                            ),
                          )),
                      SizedBox(
                        height: 30,
                      ),
                      FadeAnimation(
                          2,
                          Container(
                            height: 50,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                gradient: LinearGradient(colors: [
                                  Color.fromRGBO(143, 148, 251, 1),
                                  Color.fromRGBO(143, 148, 251, .6),
                                ])),
                            child: Center(
                                child: TextButton(
                              child: Text(
                                "Login",
                                style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold),
                              ),
                              onPressed: () {
                                _signIN();
                                //sinOut();
                              },
                            )),
                          )),
                      SizedBox(
                        height: 70,
                      ),
                      TextButton(
                        child: Text(
                          "Log Out",
                          style: TextStyle(
                              color: red, fontWeight: FontWeight.bold),
                        ),
                        onPressed: () {
                          sinOut();
                        },
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
        ));
  }

  Future<void> sinOut() async {
    try {
      SignOutResult res = await Amplify.Auth.signOut();
    } catch (error) {
      print(error);
    }
  }
}
