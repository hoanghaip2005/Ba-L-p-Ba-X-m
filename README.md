# Media For You - Frontend

Dự án Frontend cho nền tảng âm nhạc "Media For You", được phát triển trong khuôn khổ bài kiểm tra/thi. Ứng dụng cung cấp các chức năng nghe nhạc, tìm kiếm, quản lý playlist và xác thực người dùng.

## 🛠 Công Nghệ Thể Hiện
- **Framework**: [ReactJS 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Ngôn ngữ**: TypeScript
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **UI Components**: Tích hợp các components hiện đại dựa trên chuẩn [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios (Giao tiếp với API Backend tại `https://tweb.space:13626`)
- **Notifications**: Sonner

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

**1. Clone dự án (nếu bạn tải source code từ repo)**
Hoặc di chuyển thẳng vào thư mục project hiện tại.
```bash
cd <THƯ_MỤC_DỰ_ÁN>
```

**2. Cài đặt các gói phụ thuộc (Dependencies)**
```bash
npm install
```

**3. Thiết lập biến môi trường (.env)**
File `.env` phải được cài đặt ở thư mục gốc của dự án với nội dung cấu hình API như sau. Giao diện sẽ tự động đọc Base URL này (Đã được tạo sẵn file `.env`):
```env
VITE_API_BASE_URL=https://tweb.space:13626/api/v1
```

**4. Khởi chạy Ứng dụng (Chế độ Development)**
Ứng dụng buộc phải có từ khóa chạy dev là `start` (theo yêu cầu). Hãy gõ lệnh sau ở Terminal:
```bash
npm start
```
*Ghi chú: Lệnh `npm start` sẽ khởi chạy `vite` thay vì `npm run dev` thông thường.*

Trình duyệt sẽ hiển thị ứng dụng tại `http://localhost:5173/`.

---

## 🏗 Cấu Trúc Thư Mục

- `public/`: Chứa các tài nguyên tĩnh không cần bundle (logo, etc).
- `src/`
  - `components/`: UI Components thiết kế riêng dạng Reusable.
    - `layout/`: Navbar và các khung bố cục giao diện chính.
    - `ui/`: Các base component từ Shadcn UI (Button, Card, Input...).
  - `contexts/`: React Context xử lý Global State, điển hình là `AuthContext` (Quản lý User login).
  - `lib/`: Utils chung và Axios config (`api.ts`).
  - `pages/`: Từng router page của ứng dụng (Home, Login, Profile, v.v).
  - `App.tsx` & `main.tsx`: Các cổng mount App và config Routing.

---

## 📺 Lưu ý cho Bài Thi (Dành cho Sinh Viên)

Để hoàn thành nộp bài trên LMS, sinh viên cần thực hiện đúng theo các yêu cầu Quay và Nộp video sau:
1. Tải và thiết lập **OBS Studio**.
2. **Cấu hình Video OBS**: 
   - Độ phân giải Output: `1920x1080`
   - Video Bitrate: `720 Kbps`
   - FPS: `24`
3. Trong suốt quá trình vận hành dự án này, **PHẢI** quay lại toàn bộ màn hình (Display Capture), bắt buộc phải thấy rõ toàn bộ:
   - Thành System tray
   - Thanh Taskbar hiển thị rõ các tab đang mở
   - Đồng hồ hệ thống (System clock) ở góc dưới cùng bên phải.
4. Export video và upload lên **YouTube**.
5. Nộp link YouTube lên nền tảng LMS **trước 12h00 trưa cùng ngày**!

## 🔖 Tính năng đáp ứng (Chức năng API)
1. **Auth**: Đăng ký, Đăng nhập, Xem thông tin User đang đăng nhập (Protected route), và Đăng xuất.
2. **Songs**: Load danh sách bài hát có phân trang, Tìm kiếm theo tựa đề (CardView). Xem chi tiết bài hát, coverart & metadata, hỗ trợ Audio player nếu có URL.
3. **Playlists**: Duyệt Playlist public. Hiển thị Playlist cá nhân dưới dạng Tab khi đã xác thực. Tạo Playlist mới. Vào Playlist để Add bài hát, Remove bài hát khỏi hàng chờ.
