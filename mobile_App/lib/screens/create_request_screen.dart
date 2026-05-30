import 'package:flutter/material.dart';

class CreateRequestScreen extends StatefulWidget {
  const CreateRequestScreen({super.key});

  @override
  State<CreateRequestScreen> createState() => _CreateRequestScreenState();
}

class _CreateRequestScreenState extends State<CreateRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  void _submit() {
    if (_formKey.currentState!.validate()) {
      // TODO: Gửi request lên Backend API
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kêu gọi hỗ trợ'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('TIÊU ĐỀ', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(hintText: 'Nhập tiêu đề (VD: Cần nhu yếu phẩm)'),
                  validator: (value) => value!.isEmpty ? 'Vui lòng nhập tiêu đề' : null,
                ),
                const SizedBox(height: 24),
                const Text('MÔ TẢ CHI TIẾT', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _descriptionController,
                  maxLines: 5,
                  decoration: const InputDecoration(hintText: 'Mô tả tình trạng hiện tại...'),
                  validator: (value) => value!.isEmpty ? 'Vui lòng nhập mô tả' : null,
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  onPressed: _submit,
                  child: const Text('Đăng Bài', style: TextStyle(fontSize: 16)),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
