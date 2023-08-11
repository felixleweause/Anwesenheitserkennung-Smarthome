import 'package:beta_app/Screen/home.dart';
import 'package:beta_app/Screen/login.dart';
import 'package:beta_app/logig/lade_logig.dart';
import 'package:flutter/material.dart';





var finaluser ;
var finalpass ;

var email;
var bridge_status;
var email_status;
bool amplifyConfigured =  false ;

class Splashscreen extends StatefulWidget {
  @override
  _SplashscreenState createState() => _SplashscreenState();
}

class _SplashscreenState extends State<Splashscreen> {
  @override

  void initState() {
    super.initState();
    main();
  }


  void main(){

    check();
    print(amplifyConfigured);
    check().whenComplete(() => Navigator.push(context, MaterialPageRoute(builder: (context) => email_status ? HomeScreen() : login())));
  }




  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        child: Center(
          child: Column(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.only(top: 250.0),
                child: Text('Beta 42',
                    style: TextStyle(
                        fontFamily: 'Antra', color: Colors.red, fontSize: 36)),
              ),
              SizedBox(
                height: 200.0,
                width: 200.0,),
              Padding(
                padding: const EdgeInsets.only(top: 200.0),
                child: Text('Beta version',
                    style: TextStyle(
                        fontFamily: 'Antra',
                        color: Colors.blueGrey,
                        fontSize: 10.0)),
              )
            ],
          ),
        ),
      ),
    );
  }
}