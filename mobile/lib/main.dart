
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(MyApp());

class MyApp extends StatefulWidget {
  @override State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  IO.Socket? socket;
  StreamSubscription<Position>? posStream;
  bool tracking = false;
  int driverId = 1001; // demo driver id
  int cargoId = 1; // demo cargo id
  String backendBase = 'https://transitsng-backend-v2.onrender.com'; // set your backend

  @override void initState(){
    super.initState();
    // connect socket
    socket = IO.io(backendBase, <String, dynamic>{ 'transports': ['websocket'], 'autoConnect': false });
    socket?.connect();
    socket?.on('connect', (_) => print('socket connected: ' + socket!.id));
    socket?.on('location_update', (data) => print('loc update: $data'));
  }

  void startTracking() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if(!serviceEnabled) return;
    LocationPermission permission = await Geolocator.checkPermission();
    if(permission == LocationPermission.denied) permission = await Geolocator.requestPermission();
    if(permission == LocationPermission.deniedForever) return;

    posStream = Geolocator.getPositionStream().listen((Position pos) {
      final lat = pos.latitude;
      final lon = pos.longitude;
      // emit via socket
      socket?.emit('driver_location', { 'driverId': driverId, 'cargoId': cargoId, 'lat': lat, 'lon': lon, 'speed': pos.speed });
      // also POST to REST for persistence
      try{
        http.post(Uri.parse('$backendBase/api/v1/track/location'), body: json.encode({ 'driverId': driverId, 'cargoId': cargoId, 'lat': lat, 'lon': lon, 'speed': pos.speed }), headers: {'Content-Type':'application/json'});
      }catch(e){}
    });
    setState(()=> tracking = true);
  }

  void stopTracking(){ posStream?.cancel(); setState(()=> tracking=false); }

  @override void dispose(){ posStream?.cancel(); socket?.disconnect(); super.dispose(); }

  @override Widget build(BuildContext context){
    return MaterialApp(home: Scaffold(appBar: AppBar(title: Text('TransitSNG Mobile')),
      body: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        ElevatedButton(onPressed: tracking? stopTracking : startTracking, child: Text(tracking? 'Stop tracking' : 'Start tracking')),
        SizedBox(height:20),
        Text('Driver ID: $driverId, Cargo ID: $cargoId')
      ])),));
  }
}
