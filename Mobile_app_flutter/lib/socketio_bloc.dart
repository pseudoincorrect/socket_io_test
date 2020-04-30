import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketIoBlocsProvider extends InheritedWidget {
  final SocketIobloc sBloc;

  SocketIoBlocsProvider({Key key, Widget child, this.sBloc})
      : super(key: key, child: child);

  bool updateShouldNotify(_) => true;

  static SocketIobloc of(BuildContext context) {
    return context
        .dependOnInheritedWidgetOfExactType<SocketIoBlocsProvider>()
        .sBloc;
  }
}

class SocketIobloc {
  IO.Socket socket;
  IO.Socket socketDl;
  String appId;
  bool isUpdating;

  SocketIobloc({String appId}) {
    this.appId = appId;
    this.isUpdating = false;
    this.initSocketIo();
  }

  void sendUpdate() {
    this
        .socketDl
        .emit('flutterButton', 'event from socket ${this.socketDl.id}');
  }

  void initSocketIo() {
    //////////////////////////////////////////////////////////////
    // Downlink namespace ('/downlink')

    this.socketDl = IO.io('http://10.0.2.2:80/downlink', <String, dynamic>{
      'transports': ['websocket']
    });

    this.socketDl.on('connect', (_) {
      this.socketDl.on('connected', (data) => print(data));
      this.socketDl.emit('joinRoom', this.appId);
      this.socketDl.on('roomJoined', (roomId) {
        this.isUpdating = true;
        print('room joined, id: $roomId');
      });
      if (!this.isUpdating) {
        this.socketDl.on('update', (data) => print(data));
      }
    });

    this.socketDl.on('disconnect', (_) {
      this.isUpdating = false;
      print('disconnected from /downlink');
    });

    //////////////////////////////////////////////////////////////
    // Main namespace ('/')
    this.socket = IO.io('http://10.0.2.2:80', <String, dynamic>{
      'transports': ['websocket']
    });

    this.socket.on('connect', (_) {
      this.socket.on('connected', (data) => print(data));
    });

    this.socket.on('disconnect', (_) => print('disconnected from /'));

    //////////////////////////////////////////////////////////////
  }
}

SocketIobloc sBloc;
