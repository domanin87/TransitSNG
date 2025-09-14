import 'package:flutter/material.dart';

class LiveMapPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Live Map (подключение к Socket.IO/REST)', key: ValueKey('map')));
  }
}
