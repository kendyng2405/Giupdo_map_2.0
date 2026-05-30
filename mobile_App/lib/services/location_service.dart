import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile_app/core/api_constants.dart';

class LocationService {
  static Future<List<dynamic>> fetchLocations() async {
    try {
      final response = await http.get(Uri.parse(ApiConstants.locations));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      print('Lỗi tải dữ liệu địa điểm: $e');
      return [];
    }
  }
}
