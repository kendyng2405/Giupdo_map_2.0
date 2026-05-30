import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  void _handleLogin() async {
    setState(() => _isLoading = true);
    // TODO: Gọi API Login
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isLoading = false);
    
    // Nếu thành công thì chuyển qua MapScreen
    // Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const MapScreen()));
  }

  @override
  Widget build(BuildContext context) {
    // SafeArea bọc toàn bộ màn hình để không bị lẹm vào thanh trạng thái iPhone
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              Icon(Icons.favorite, color: Theme.of(context).primaryColor, size: 60),
              const SizedBox(height: 24),
              const Text(
                'Đăng nhập',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Chào mừng trở lại cộng đồng!',
                style: TextStyle(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              const Text('EMAIL', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              TextField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  hintText: 'Nhập email của bạn',
                ),
              ),
              const SizedBox(height: 24),
              const Text('MẬT KHẨU', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              TextField(
                controller: _passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  hintText: 'Nhập mật khẩu',
                ),
              ),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: _isLoading ? null : _handleLogin,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Đăng nhập', style: TextStyle(fontSize: 16)),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () {
                  // Chuyển sang RegisterScreen
                },
                child: Text('Chưa có tài khoản? Đăng ký ngay', 
                  style: TextStyle(color: Theme.of(context).primaryColor)),
              )
            ],
          ),
        ),
      ),
    );
  }
}
