import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  final List<Widget> _pages = [
    HomeScreen(),
    AScreen(),
    BScreen(),
    CScreen(),
  ];

  void onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blueGrey,
      appBar: AppBar(
        title: const Text(
          'Thrive',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.blueGrey[900],
      ),
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: onTabTapped,
        currentIndex: _currentIndex,
        backgroundColor: Colors.black, // <-- This works for fixed
        selectedItemColor: Colors.deepPurpleAccent,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.audiotrack), label: 'A'),
          BottomNavigationBarItem(icon: Icon(Icons.beach_access), label: 'B'),
          BottomNavigationBarItem(icon: Icon(Icons.cake), label: 'C'),
        ],
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Image(
        image: AssetImage('images/icon.jpg'),
      ),
    );
  }
}

class AScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('A'));
  }
}

class BScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('B'));
  }
}

class CScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('C'));
  }
}
