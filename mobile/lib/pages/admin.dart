import 'package:flutter/material.dart';

class AdminPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Админ панель: управление главной, тарифами, пользователями', key: ValueKey('admin')));
  }
}
