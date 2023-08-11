import 'package:beta42/api/bridge.dart';
import 'package:beta42/style.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum DialogAction { yes, abort }

String label_1_text;
String label_2_text;

class Dialogs {
  static Future<DialogAction> yesAbortDialog(
      BuildContext context,
      String title,
      String body,
      String label_1,
      String label_2,
      ) async {
    final action = await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: background,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          title: Text(title, style: TextStyle(color: script),),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(body, style: TextStyle(color: script),),
              SizedBox(height: 20,),
              TextField(
                style: TextStyle(color: script),
                decoration: InputDecoration(
                  labelText: label_1,
                  labelStyle: new TextStyle(color: red),
                  fillColor: script,

                ),
                onChanged: (text) {
                  label_1_text = text;
                },
              ),
              SizedBox(height: 20,),
              TextField(
                style: TextStyle(color: script),
                decoration: InputDecoration(
                    labelText: label_2,
                    labelStyle: new TextStyle(color: red),
                    fillColor: script
                ),
                onChanged: (text) {
                   label_2_text = text;
                },
              ),
            ],
          ),
          actions: <Widget>[
            RaisedButton(onPressed: (){
               Navigator.pop(context);
             },
              color: red,
              child:
              const Text(
                'Abbrechen',
                style: TextStyle(
                  color: script,
                ),
              ),
            ),
            RaisedButton(
              onPressed: () async {
                SharedPreferences prefs = await SharedPreferences.getInstance();
                prefs.setString(label_1,label_1_text);
                prefs.setString(label_2,label_2_text);
                person_scanner_data();
                Navigator.of(context).pop(DialogAction.yes);
              },
              color: red,
              child: const Text(
                'Fertig',
                style: TextStyle(
                  color: script,
                ),
              ),
            ),
          ],
        );
      },
    );
    return (action != null) ? action : DialogAction.abort;
  }
}