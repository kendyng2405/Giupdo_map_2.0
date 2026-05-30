import 'package:flutter/material.dart';
import 'package:mobile_app/core/theme.dart';
import 'package:mobile_app/screens/splash_screen.dart';

void main() {
  runApp(const TraiTimVietApp());
}

class TraiTimVietApp extends StatelessWidget {
  const TraiTimVietApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Trái Tim Việt',
      debugShowCheckedModeBanner: false,
      theme: appTheme,
      home: const SplashScreen(),
    );
  }
}
