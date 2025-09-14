import 'package:flutter/material.dart';

class SearchBar extends StatefulWidget {
  @override _SearchBarState createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  String from = '';
  String to = '';
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          children: [
            TextField(decoration: InputDecoration(prefixIcon: Icon(Icons.location_on), hintText: 'Откуда'), onChanged: (v)=> setState(()=>from=v)),
            SizedBox(height:8),
            TextField(decoration: InputDecoration(prefixIcon: Icon(Icons.flag), hintText: 'Куда'), onChanged: (v)=> setState(()=>to=v)),
            SizedBox(height:8),
            Row(mainAxisAlignment: MainAxisAlignment.end, children: [ElevatedButton(onPressed: (){}, child: Text('Найти'))])
          ],
        ),
      ),
    );
  }
}
