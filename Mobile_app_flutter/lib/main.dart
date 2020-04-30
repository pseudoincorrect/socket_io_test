import 'package:flutter/material.dart';
import 'package:socket_io_test/socketio_bloc.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    sBloc = SocketIobloc(appId: 'app1');
    return SocketIoBlocsProvider(
      sBloc: sBloc,
      child: MaterialApp(
        title: 'Flutter Socket IO',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: MyHomePage(title: 'Flutter Socket IO'),
      ),
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
  int _counter = 0;
  SocketIobloc sbloc;

  void _pushButtonCallback() {
    sBloc.sendUpdate();
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    this.sbloc = SocketIoBlocsProvider.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Update(s) sent to the server via Socket.io',
            ),
            Container(height: 10),
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
