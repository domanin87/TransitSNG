import 'package:flutter/material.dart';
import 'pages/home.dart';
import 'pages/cargo_list.dart';
import 'pages/chat.dart';
import 'pages/tariffs.dart';
import 'pages/map_live.dart';
import 'pages/admin.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() {
  runApp(TransitSNGApp());
}

class TransitSNGApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Транзит СНГ',
      theme: ThemeData(primarySwatch: Colors.indigo),
      localizationsDelegates: [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: [Locale('ru'), Locale('kk'), Locale('uz'), Locale('uk'), Locale('az')],
      home: MainRouter(),
    );
  }
}

class MainRouter extends StatefulWidget {
  @override
  _MainRouterState createState() => _MainRouterState();
}

class _MainRouterState extends State<MainRouter> {
  int _selected = 0;
  final _pages = [HomePage(), CargoListPage(), ChatPage(), TariffsPage(), LiveMapPage(), AdminPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedSwitcher(duration: Duration(milliseconds: 400), child: _pages[_selected]),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selected,
        onTap: (i) => setState(() => _selected = i),
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Главная'),
          BottomNavigationBarItem(icon: Icon(Icons.local_shipping), label: 'Грузы'),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Чат'),
          BottomNavigationBarItem(icon: Icon(Icons.attach_money), label: 'Тарифы'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Карта'),
          BottomNavigationBarItem(icon: Icon(Icons.admin_panel_settings), label: 'Админ'),
        ],
      ),
    );
  }
}
