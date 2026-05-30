import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/services/location_service.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  List<dynamic> _locations = [];

  @override
  void initState() {
    super.initState();
    _loadLocations();
  }

  Future<void> _loadLocations() async {
    final data = await LocationService.fetchLocations();
    setState(() {
      _locations = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bản đồ từ thiện'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: FlutterMap(
        options: const MapOptions(
          initialCenter: LatLng(16.047079, 108.206230), // Da Nang
          initialZoom: 6.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            userAgentPackageName: 'com.traitimviet.app',
          ),
          MarkerLayer(
            markers: _locations.map((loc) {
              final coordinates = loc['location']['coordinates'];
              return Marker(
                point: LatLng(coordinates[1], coordinates[0]),
                width: 40,
                height: 40,
                child: const Icon(Icons.location_on, color: Colors.red, size: 40),
              );
            }).toList(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Mở màn hình tạo yêu cầu giúp đỡ
        },
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
