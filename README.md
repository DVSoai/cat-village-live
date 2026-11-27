# Làng Mèo Online

Prototype V0.1 — Three.js, Vite, tỉ lệ 9:16, 20 chú mèo và bảng giả lập sự kiện TikTok.

Chạy bản demo: `npm install && npm run dev`.

## TikTok LIVE (thử nghiệm)

1. Mở TikFinity Desktop trên máy phát và kết nối phiên TikTok LIVE.
2. Chạy game bằng `npm install && npm run dev` trên cùng máy.
3. Trong bảng điều khiển nhập WebSocket URL (mặc định thử nghiệm `ws://localhost:21213/`), chọn Kết nối LIVE.
4. Chat, like và gift được chuyển thành tương tác trong làng. Quà streak chỉ xử lý khi kết thúc. Phân loại quà theo tên Rose và ngưỡng diamond là quy tắc prototype, có thể cần điều chỉnh theo payload thực tế.

Trang HTTPS có thể chặn ws://; dùng game local hoặc endpoint wss:// phù hợp. Chưa xác minh với phiên LIVE thật. Không cần đưa thông tin đăng nhập TikTok vào game.

## Kiểm thử và build

```sh
node --test tests/*.test.js
npm run build
```
Workflow Test and build xuất artifact cat-village-demo độc lập với GitHub Pages. Tiến độ hiện lưu localStorage theo origin/trình duyệt, chưa đồng bộ server.
