import 'dart:convert';
import 'dart:async';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ping_discover_network/ping_discover_network.dart';
import 'package:wifi/wifi.dart';


String path = '/api';
String accessToken;
String ip;

var Mac_adress;
var Name_mac;
var Id_scanner;
var scanner_raum;

void main_bridget() {
  token_check().whenComplete(() => main());
}

void ip_get() async {
  print(ip);
  SharedPreferences prefs = await SharedPreferences.getInstance();
  ip = prefs.get('check_ip');
}

void main() async {
  final response = await http_test();
  //http_test().whenComplete(() => print(response.body.toString()));
}

Future<void> token_check() async {
  final authState = await Amplify.Auth.fetchAuthSession(
          options: CognitoSessionOptions(getAWSCredentials: true))
      as CognitoAuthSession;
  if (authState.isSignedIn) {
    accessToken = authState.userPoolTokens.idToken;
    print(accessToken);
  }
}

Future<http.Response> htt() {
  return http.post(
    Uri.http('http://' + ip + ':3000', path),
    headers: <String, String>{
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: ("token=" + accessToken + "&query=app"),
  );
}

Future<http.Response> http_test() async {
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  final response_1 = await http.post('http://' + ip + ':3000' + path,
      headers: headers, body: "token=" + accessToken + "&query=app");
  print(response_1.body);
  bridget_succes succes = bridget_succes.fromJson(jsonDecode(response_1.body));
  print(succes.succes);
}

class bridget_succes {
  bool succes;

  bridget_succes({this.succes});

  bridget_succes.fromJson(Map<String, dynamic> json) {
    succes = json['succes'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['succes'] = this.succes;
    return data;
  }
}

Future<void> person_scanner_data() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String mac = prefs.getString('Mac-Adress'); // person
  String person = prefs.getString('Name'); //person
  String id = prefs.getString('Id'); //Raum
  String raum = prefs.getString('Raum-Name'); //Raum
  String query;
  print(person);
  print(mac);
  print(id);
  print(raum);
  if (mac.isNotEmpty & person.isNotEmpty) {
    query = "add_person";
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    final response_1 = await http.post('http://' + ip + ':3000/api/',
        headers: headers,
        body: "token=" +
            accessToken +
            "&query=add_person&name=" +
            mac +
            "&name=" +
            person);
  } else if (id.isNotEmpty && raum.isNotEmpty) {
    query = "add_scanner";
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    final response_1 = await http.post('http://' + ip + ':3000/api/',
        headers: headers,
        body: "token=" +
            accessToken +
            "&query=add_scanner&id=" +
            id +
            "&name=" +
            raum);
  }
  prefs.remove("Mac-Adress");
  prefs.remove("Name");
  prefs.remove("Id");
  prefs.remove("Raum-Name");
}

Future<void> discover() async {
  String ip;
  try {
    ip = await Wifi.ip;
    print('local ip:\t$ip');
  } catch (e) {
    return;
  }

  final String subnet = ip.substring(0, ip.lastIndexOf('.'));
  int port = 3000;
  print('subnet:\t$subnet, port:\t$port');

  final stream = NetworkAnalyzer.discover(subnet, port);

  stream.listen((NetworkAddress addr) async {
    if (addr.exists) {
      print('Found device: ${addr.ip}');
      const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
      final response_1 = await http.post(
        Uri.http(addr.ip + ':3000', '/api'),
        headers: <String, String>{
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: ("query=is_beta_device"),
      );
      print(response_1.body);
      var succes = jsonDecode(response_1.body);
      print(succes);
      if (response_1.body == "{\"succes\":true}") {
        return addr.ip;
      }
    }
  })
    ..onDone(() {
      return null;
    })
    ..onError((dynamic e) {
      return null;
    });
}

