import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  IO.Socket socket;
  int _counter = 0;
  void _pushButtonCallback() {
    this.socket.emit('test');

    setState(() {
      _counter++;
    });
  }

  void initSocketIo() {
    this.socket = IO.io(
      'http://10.0.2.2:80',
      <String, dynamic>{
        'transports': ['websocket'],
      },
    );

    this.socket.on('connect', (_) {
      print('connect');
      this.socket.on("news", (data) => print(data));
      this.socket.emit('test', 'test data');
    });

    this.socket.on('event', (data) => print(data));
    this.socket.on('disconnect', (_) => print('disconnect'));
    this.socket.on('fromServer', (_) => print(_));
  }

  @override
  Widget build(BuildContext context) {
    this.initSocketIo();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _pushButtonCallback,
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }
}
