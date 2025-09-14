import 'package:flutter/material.dart';

class SampleCard extends StatelessWidget {
  final int index;
  SampleCard({required this.index});
  @override
  Widget build(BuildContext context) {
    final logged = false; // replace with auth check
    return SizedBox(
      width: 320,
      child: Card(
        elevation: 6,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Груз #$index', style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height:6),
              Text('Маршрут: Алматы → Москва'),
              SizedBox(height:6),
              Text('Цена: 120000 KZT', style: TextStyle(color: Colors.green[700])),
              SizedBox(height:8),
              Text(logged ? 'Контакты: +7-700-000-00$index' : 'Контакты скрыты — войдите', style: TextStyle(color: Colors.grey[700]))
            ],
          ),
        ),
      ),
    );
  }
}
