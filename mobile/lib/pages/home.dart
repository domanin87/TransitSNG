import 'package:flutter/material.dart';
import '../widgets/search_bar.dart';
import '../widgets/sample_card.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      key: ValueKey('home'),
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 8),
          SearchBar(),
          SizedBox(height: 16),
          Text('Активные заказы', style: Theme.of(context).textTheme.headline6),
          SizedBox(height: 8),
          Wrap(spacing: 12, runSpacing: 12, children: List.generate(6, (i) => SampleCard(index: i+1))),
        ],
      ),
    );
  }
}
