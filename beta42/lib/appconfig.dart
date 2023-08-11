import 'package:flutter/material.dart';

List<BoxShadow> shadowList = [
  BoxShadow( blurRadius: 30, offset:  Offset(0, 10))
];

List<Map> categories = [];

List<home_info> user = [home_info( "test", "test_room"),];

List<scanner_data> scanner = [
  scanner_data('flur-oben', '1.2', 'Felix-zimmer')
];

class home_info {

  String name;
  String room;

  home_info( this.name, this.room, element);
}

class home_data {
  String bridge;

  home_data({required this.bridge});
}

class scanner_data {
  String Id;
  String Version;
  String Raum;
  scanner_data(this.Id, this.Version, this.Raum);
}

//Color.fromRGBO(0, 59, 54, 1)
