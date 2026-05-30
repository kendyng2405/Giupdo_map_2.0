class ApiConstants {
  // Thay đổi URL này thành URL của Backend thật trên Render của bạn
  // Ví dụ: https://giupdo-map-backend.onrender.com/api
  static const String baseUrl = 'https://giupdo-map-backend.onrender.com/api';
  
  static const String login = '$baseUrl/users/login';
  static const String register = '$baseUrl/users/register';
  static const String locations = '$baseUrl/locations';
}
