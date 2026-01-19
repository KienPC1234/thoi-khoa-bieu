# 📅 Ứng dụng Quản Lý Thời Khóa Biểu (Schedule Manager)

Ứng dụng web hiện đại giúp học sinh, sinh viên và giáo viên quản lý thời khóa biểu học tập một cách trực quan, dễ dàng và hiệu quả.

## ✨ Lý Do Thiết Kế & Triết Lý Sản Phẩm

Trong quá trình học tập và làm việc, việc theo dõi lịch trình là vô cùng quan trọng. Tuy nhiên, các giải pháp hiện tại thường gặp phải các vấn đề:
- **Giao diện cũ kỹ, nhàm chán**: Khó tạo cảm hứng sử dụng hàng ngày.
- **Khó tùy biến**: Không thể thay đổi số tiết, giờ nghỉ trưa linh hoạt.
- **Trải nghiệm in ấn kém**: Xuất file PDF thường bị lỗi font, vỡ bố cục hoặc không vừa khổ giấy A4.
- **Thiếu chế độ Dark Mode**: Gây mỏi mắt khi sử dụng vào ban đêm.

👉 **Giải pháp của chúng tôi:**
Một ứng dụng tập trung vào **Trải nghiệm người dùng (UX/UI)** với giao diện Glassmorphism hiện đại, hỗ trợ **Dark Mode** hoàn hảo, và khả năng **Xuất PDF chuẩn A4** tối ưu cho việc in ấn.

## 🚀 Tính Năng Nổi Bật

### 1. 🎨 Giao Diện Hiện Đại & Thân Thiện
- **Glassmorphism Design**: Hiệu ứng kính mờ, đổ bóng tinh tế, tạo cảm giác sang trọng và nhẹ nhàng.
- **Adaptive Dark/Light Mode**: 
  - ☀️ **Light Mode**: Sáng sủa, sạch sẽ, tối ưu độ tương phản cho việc đọc ngoài trời.
  - 🌙 **Dark Mode**: Dịu mắt, bảo vệ thị lực trong môi trường thiếu sáng, với tông màu xanh đen (Slate/Midnight) chuyên nghiệp.
- **Responsive**: Hiển thị tốt trên cả máy tính và máy tính bảng.

### 2. 🛠️ Quản Lý Linh Hoạt
- **Đa Thời Khóa Biểu**: Tạo và lưu trữ nhiều bảng TKB khác nhau (Ví dụ: HK1, HK2, Lớp học thêm...).
- **Cấu hình mạnh mẽ**:
  - Tùy chỉnh Tên bảng, Năm học.
  - Thay đổi tổng số tiết học trong ngày (lên đến 15 tiết).
  - Thêm dòng ngăn cách (Nghỉ trưa/Nghỉ giữa giờ) tùy ý.
- **Thao tác nhanh**: Thêm, sửa, xóa môn học chỉ với 1 cú click chuột. Kéo thả (dự kiến) trong tương lai.

### 3. 🖨️ Xuất PDF Chuyên Nghiệp
- **Chuẩn khổ giấy A4 Ngang (Landscape)**: Tự động căn chỉnh để toàn bộ thời khóa biểu nằm gọn trong 1 trang giấy.
- **Style In Ấn Cổ Điển**: Chuyển đổi giao diện web sang dạng bảng in đen trắng truyền thống, tiết kiệm mực in và dễ đọc.
- **Fix lỗi hiển thị**: Tự động xuống dòng khi tên môn học quá dài, không bị mất chữ.

### 4. 💾 Lưu Trữ & Đồng Bộ
- Dữ liệu được lưu trực tiếp trên trình duyệt (Cookies/LocalStorage), đảm bảo riêng tư và truy cập nhanh chóng mà không cần đăng nhập.
- Tự động ghi nhớ trạng thái Dark/Light mode của người dùng.

## 🛠️ Công Nghệ Sử Dụng

Dự án được xây dựng trên nền tảng các công nghệ web tiên tiến nhất hiện nay:
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router) - Hiệu năng cao, SEO tốt.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Thiết kế giao diện nhanh chóng, linh hoạt.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Hiệu ứng chuyển động mượt mà.
- **Icons**: [Lucide React](https://lucide.dev/) - Bộ icon hiện đại, nhẹ nhàng.
- **PDF Export**: `html2pdf.js` - Xử lý xuất file PDF phía client.
- **State Management**: React Hooks & Cookies.

## 📦 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu
- Node.js (phiên bản 18 trở lên)
- Trình quản lý gói: npm, yarn, pnpm hoặc bun

### Các bước thực hiện

1.  **Clone dự án:**
    ```bash
    git clone https://github.com/KienPC1234/thoi-khoa-bieu.git
    cd thoi-khoa-bieu
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```

3.  **Chạy server phát triển (Development):**
    ```bash
    npm run dev
    ```
    Mở trình duyệt và truy cập: `http://localhost:3000`

4.  **Build bản production:**
    ```bash
    npm run build
    npm start
    ```

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Nếu bạn tìm thấy lỗi hoặc có ý tưởng mới, hãy tạo **Issue** hoặc gửi **Pull Request**.

---
**Made with ❤️ by [Ha Tri Kien]**