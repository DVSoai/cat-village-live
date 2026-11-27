# LÀNG MÈO ONLINE — GDD V1.1
Ngày: 2026-11-27 · Trạng thái: thiết kế core loop / prototype · Thay thế quy tắc chat của GDD V1.0

## 0. Chẩn đoán sản phẩm (không né tránh)
V0.1 có cảnh làng đẹp và 20 mèo đi lại nhưng chưa có hành động chính rõ trong ba giây; khán giả không có vai trò, hồ sơ, cấp độ hay thứ gì của riêng mình; làng không cần giúp đỡ và thiếu căng thẳng nhẹ, đếm ngược, câu chuyện, phần thưởng. Kết quả: dễ rời livestream sau vài chục giây. Đừng nhầm các nút giả lập và hiệu ứng với một vòng lặp giữ chân thực sự.

## 1. Lời hứa trải nghiệm
“Trong 3 giây biết làng đang cần gì; trong 30 giây giúp được làng miễn phí; trong 5 phút có chuyện đáng chờ; ngày mai còn câu chuyện của mình.”
- **Không pay-to-win, không ép donate, không chấm điểm sức khỏe thật của người xem.**
- 20 mèo **cư dân chính** cố định, có tên, công việc và tính cách. Mèo khách là visitor VFX 60 giây, tối đa 10, KHÔNG thuộc dân số 20, KHÔNG tạo tài sản riêng hoặc nhân bản kinh tế.
- Mỗi hành động đều có phản hồi trong 2 giây: âm thanh nhẹ/hiệu ứng, mèo nhìn người xem hoặc vẫy đuôi, hiển thị tên.
- LIVE OBS hiển thị 9:16, HUD ngắn gọn. Các nút điều khiển và bảng xếp hạng chi tiết thuộc panel ngoài màn hình LIVE; Top 3 nằm trên HUD.
- Bảo vệ trải nghiệm: tình trạng Đói/Vui/An Toàn thấp gây buồn/chậm đi, **không giết mèo, không phá dữ liệu**, tự phục hồi một phần để người xem không bị ép mua quà.

## 2. Core Loop — ba tầng nhịp độ
```
0–3 giây: Đọc HUD (mục tiêu hiện tại + đếm ngược + Top 3 + 3 thanh)
  → 0–30 giây: chat / thả tim / chọn đội, mèo phản ứng ngay, ghi tên
  → 60–90 giây: micro-event (cá mắc câu, hoa nở, mèo con thăm làng)
  → 5 phút: major-event (đua mèo / thử thách / Mèo Vàng / hội làng)
  → 30 phút: mốc câu chuyện (xây cầu / mở khu / tổng kết ngày)
  → ngày hôm sau: trở lại xem mèo quen, streak, bộ sưu tập và 3 nhiệm vụ mới
```
**Bốn câu hỏi nghiệm thu bắt buộc với MỌI cơ chế mới:** (1) 3 giây đầu nhìn thấy việc gì? (2) 30 giây đầu bấm/làm gì và thưởng gì? (3) 5 phút tiếp theo chờ gì? (4) ngày mai quay lại vì điều gì?

## 3. HUD (quan trọng nhất)
- Vùng đầu: **MỤC TIÊU** dạng “Thu hoạch 18/20 rau để mở lễ hội”; tiến độ chung + hũ quà.
- Dưới đầu: **Ba đếm ngược** Micro 01:12 / Hội làng 04:20 / Mốc xây cầu 23:10 (luôn cập nhật, không mâu thuẫn với thời gian thực).
- **3 thanh**: Đói (No), Vui, An Toàn. Dễ hiểu bằng icon màu, số %, không cần đọc hướng dẫn.
- **Top 3** dưới thanh để người xem biết ai đang giúp làng (điểm từ hành động miễn phí + quà).
- Dòng onboarding quay vòng: “💬 Chat để mèo khách chào bạn · ❤️ Tim để làng vui · !cam / !xanh để chọn đội”.
- Không che đường chính hoặc chiếm >~25% chiều cao; màn hình nhỏ cần kiểm tra trực quan.

## 4. Quy tắc mô phỏng và lịch sự kiện
- **30 giây:** feedback tối đa 2 giây sau chat/like. Mỗi 30 giây nếu im lặng, 1 mèo chính thể hiện hành động nhỏ tự nhiên.
- **90 giây:** xoay vòng câu cá, hoa nở, khách mèo con; sự kiện không thu phí và không yêu cầu đủ viewers.
- **5 phút:** xoay vòng đua 6 mèo, tìm mèo lạc, cứu vườn sau mưa, Mèo Vàng hiếm hoặc lễ hội. Cần lệnh dễ đọc và có cơ chế miễn phí để giải quyết.
- **30 phút:** chọn mốc công trình/ tổng kết theo tiến độ; kể lại tên những người góp sức; world-state tích lũy.
- Bất ngờ không được là hộp đen ép mua quà; xác suất và phần thưởng chỉ là điểm, vật phẩm trang trí, danh hiệu, không có tiền thật.
- Lịch sử sự kiện chỉ dùng trong một phiên trình duyệt; khi reload tạo lại lịch, tránh “catch-up” hàng trăm sự kiện.

## 5. Làng cần giúp — ba trạng thái (0–100)
- Đói giảm chậm theo thời gian; người xem chat `!choan` hoặc quà thức ăn tăng Đói.
- Vui giảm chậm; like, follow, chat hoặc hoạt động hội làng tăng Vui.
- An Toàn giảm chậm; chat `!baove` hoặc hoa / quà tăng An Toàn.
- Dưới 25: mèo giảm tốc/ buồn, HUD cảnh báo. Từ 25–75: hoạt động thường. Trên 75: ánh sáng/ hoạt ảnh vui.
- Làng **tự phục hồi nhỏ** khi quá thấp, không tạo vòng lặp áp lực chi tiền.

## 6. Hồ sơ, tính cách, nhiệm vụ ngày
- Mỗi TikTok display/unique ID đã chuẩn hóa: points, level Khách→Dân Làng→Ân Nhân, streak theo **ngày ghé thăm** (đếm streak ngày, khác biệt so với “3 buổi live liên tiếp” — cần server session ID khi vận hành thật), danh hiệu, bộ sưu tập 20 mèo, nhóm Cam/Xanh, 3 daily tasks.
- Tên mèo chính theo ID ổn định: Mít (ham ăn), Mơ (lười), Muối (nhát), Ông Râu (trưởng làng), Bông, Nếp, Đốm, Gạo, Vừng, Bơ, Na, Kem, Sữa, Tiêu, Mận, Sấu, Cốm, Tôm, Gừng, Lạc. Mỗi mèo có story ngắn, bộ sưu tập chỉ ghi dấu gặp mèo theo tương tác/ lượt ghé (không nhận dạng thật).
- Nhiệm vụ phiên/ngày: 20 lượt tương tác miễn phí, trồng/ cứu 15 hoa, cùng hoàn thành một sự kiện; thưởng điểm/ huy hiệu, reset UTC+7 ngày tiếp theo. Streak giảm khi bỏ qua một ngày; không reset điểm.
- Chỉ localStorage V1.1 prototype; **không có đồng bộ nhiều máy/người livestream**, không lưu token/ email/ số điện thoại. Khi dùng thật cần server store + kiểm soát trùng tên/ spoofing.

## 7. Kịch tính dịu và hai đội
- Ba vấn đề định kỳ: cáo lấy cá (chat `!duoi`), mưa làm ướt ruộng (`!che`), mèo con lạc (`!tim`), mỗi sự kiện có timer 90 giây, đủ tương tác chung thì giải quyết, nếu thất bại chỉ giảm nhẹ trạng thái, không gây mất tài sản.
- Chọn Đội Cam (`!cam`) hoặc Xanh (`!xanh`), đổi đội sau mỗi 5 phút để tránh spam; điểm đội từ like/chat nhiệm vụ, không tính tiền là điều kiện thắng; đội thua được tặng quà trang trí nhỏ như đội thắng.
- Top 10, Top 3 trực tiếp, Người hùng ngày, cuối phiên báo cáo thành tựu và lịch phát sóng sau nếu chủ kênh cung cấp. Không bịa thời gian live kế tiếp.

## 8. Tính năng Đợt 1 và luật chơi 3 dòng
### 8.1 Gift Jar
1. ❤️ hoặc quà đóng góp vào cùng hũ, không yêu cầu tặng quà.
2. Hũ 1000 điểm thì mở một mục tiêu chung và xướng tên Top đóng góp.
3. Người xem trở lại để thấy cầu/hội làng và được ghi nhận.

### 8.2 Top 10 và danh hiệu
1. Chat/like/giúp làng nhận điểm và xuất hiện bảng Top.
2. Danh hiệu: Khách Quen (3 ngày liên tiếp), Ân Nhân (100 xu giả lập/quà), Vua Câu Cá (20 cá), Người Trồng Hoa (10 hoa).
3. Lần sau quay lại còn điểm, nếu cùng trình duyệt/nguồn dữ liệu.

### 8.3 Mèo Vàng
1. Xem đồng hồ dự đoán (20–30 phút), quà lớn kích hoạt ngay.
2. Khi xuất hiện cả làng vui, camera zoom, xướng tên nếu có người hỗ trợ.
3. Bộ sưu tập đánh dấu gặp loài hiếm, là khoảnh khắc quay lại.

### 8.4 Đua mèo
1. Gõ `!chon 1..6` để chọn mèo miễn phí.
2. Mỗi 15 phút 6 mèo chạy khoảng 60 giây, hoa hồng chỉ tăng cheer, không đảm bảo thắng.
3. Người chọn đúng nhận điểm và vinh danh, không phạt người thua.

### 8.5 Xướng tên
1. Follow/quà → tên hiển thị 3–5 giây, zoom vùng sự kiện.
2. Giọng đọc tiếng Việt qua Web Speech API nếu trình duyệt hỗ trợ và đã cho phép âm thanh.
3. Đảm bảo không đọc nội dung độc hại/URL hoặc nối hàng chờ TTS dài.

### 8.6 Mốc like
1. Mỗi 1000 like là cá rơi/tưới cây.
2. HUD hiển thị số like còn lại; mưa cá có hiệu ứng.
3. Mốc tích lũy qua phiên cục bộ.

### 8.7 Mèo khách
1. Chat bất kỳ → mèo khách có tên/avatar ở quảng trường trong 60 giây.
2. Tối đa 10 khách; người thứ 11 thay khách cũ, không chạm cư dân chính.
3. Phản hồi ngay và có lý do ghé lại; đây là **sửa quy tắc GDD V1.0 “chat không tạo mèo”**, chấp nhận visitor ảo tạm thời nhưng không tạo cư dân/kinh tế của riêng viewer.

## 9. Quà TikTok: mapping theo **sự kiện**, không hard-code bảng giá
- Rose/Hoa Hồng: thường 1 coin, +1 hoa, +10 điểm hũ, +1 An Toàn. Giá có thể đổi theo vùng/thời điểm. Nguồn: https://blog.tikfinity.com/vi/tiktok-rose-gift/
- Các quà còn lại dùng giá trị **diamondCount do event thực cung cấp**, x số lượng của combo sau khi kết thúc. Không giả định mọi quà thức ăn đều 10 coin.
- Quà >=100 coin/diamonds trong mô phỏng: kích hoạt Mèo Vàng hoặc hội làng. Đây là ngưỡng gameplay, không phải công bố giá quà thật.
- Xử lý giftType=1 repeatEnd để không tính đôi combo. Chưa kiểm thử với phiên TikTok LIVE thực.
- Like/chat/follow miễn phí được cộng điểm đủ để tiến triển 3 thanh và mục tiêu, bảo đảm chơi không phụ thuộc quà.

## 10. Tiêu chí nghiệm thu
| Mục tiêu | Pass khi |
|---|---|
| 3 giây | HUD có mục tiêu, 3 countdown, 3 trạng thái, top 3 từ frame đầu |
| 30 giây | chat và like hiển thị tên + mèo phản ứng <2 giây; không cần donate |
| 90 giây | micro-event chạy từ timer với hiệu ứng |
| 5 phút | major-event chạy từ timer với feedback và phần thưởng |
| 30 phút | milestone tổng kết tự động và world-state thay đổi |
| Hồ sơ | điểm, level, streak, collection và nhiệm vụ ngày lưu, reload còn dữ liệu |
| Drama | chat lệnh giải quyết vấn đề, cả làng vui; thất bại không phá làng |
| Social | chọn Cam/Xanh, Top 3 trực tiếp, Top 10 trong panel |
| Mèo | chính xác 20 mèo chính, 0–10 mèo khách |
| LIVE | 9:16, ≥30 FPS trên máy kiểm thử đủ cấu hình, không che cảnh hoặc tràn chữ |
| Triển khai | npm test/build pass, Pages HTTP 200, screenshot/video từ browser, xem liên tục 5 phút |
Chưa quan sát đủ 5 phút trong browser thì mục đó phải đánh dấu **chưa nghiệm thu**.

## 11. Roadmap cố định
**P0** GDD + HUD + loop 90s/5m/30m + 3 thanh + hồ sơ.
**P1** Các feature Đợt 1 hoàn chỉnh và polish animation/camera/race + xử lý combo.
**P2** Câu cá, vườn gắn tên, thời tiết âm thanh, nhiệm vụ nâng cao.
**P3** Chợ làng, đố vui, ASMR đêm.
