import 'package:http/http.dart' as http;

Future<void> scanner_config(ssid, key, id, ip ) async {
  print(ssid);
  print(key);
  print(ip);
  print(id);
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  final response_1 = await http.post('http://10.0.0.1:8080/save_credentials', headers: headers, body: "ssid=" + ssid + "&wifi_key=" + key + "&id=" + id + "&ip=" + ip);

}