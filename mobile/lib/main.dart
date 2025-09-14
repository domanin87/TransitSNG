import 'package:flutter/material.dart';
void main()=> runApp(TransitsApp());
class TransitsApp extends StatelessWidget{
  @override Widget build(BuildContext context){
    return MaterialApp(
      title: 'Транзит СНГ',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: HomePage(),
    );
  }
}
class HomePage extends StatelessWidget{
  @override Widget build(BuildContext context){
    return Scaffold(appBar: AppBar(title:Text('Транзит СНГ')), body: Center(child:Text('Mobile app skeleton - implement screens here')));
  }
}
