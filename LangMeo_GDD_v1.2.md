# LÀNG MÈO ONLINE — GDD V1.2 (ROADMAP THẾ GIỚI SỐNG)
Ngày 27/11/2026 | **CHỈ LÀ KẾ HOẠCH. KHÔNG ĐƯỢC TRIỂN KHAI V1.2 TRƯỚC KHI V1.1 ĐẠT NGHIỆM THU.**

Tài liệu này mở rộng [GDD V1.1](./LangMeo_GDD_v1.md), không thay thế vòng lặp giữ chân đã chốt. Quy ước: **Tương tác** (chat/like/follow/quà, luôn có cách miễn phí), **Hiệu ứng** (nhìn thấy trên 9:16), **Thưởng**, **Mở khóa**. Mọi hạng mục đều phải vượt phép thử: nhìn thấy trong 3 giây, phản hồi 30 giây, chờ đợi trong 5 phút, có lý do quay lại ngày mai.

## Khung phát triển
- **Không đổi 20 mèo cư dân chính**. Kitten/visitor/NPC có pool riêng, object pooling và LOD; số lượng tối đa điều chỉnh dựa benchmark. "Thêm mèo" nghĩa là kitten/NPC khách, không thay đổi bộ 20 cư dân.
- 9:16, mục tiêu >=30FPS trên thiết bị OBS/PC được chốt khi benchmark. Bản đồ theo chunk/camera có vùng hoạt động, không tải toàn bộ hoạt ảnh cùng lúc.
- Người xem không sở hữu mèo chính; quyền sở hữu cá nhân là hồ sơ, bộ sưu tập, danh hiệu, cột mốc có tên, phòng/nhà trang trí về sau. Điểm/quà không quyết định khả năng tồn tại của làng.
- Mốc mở khóa **Lv1→Lv10**, mỗi cấp có một mục tiêu miễn phí và phát thưởng biểu tượng cho mọi người.

## A. Khu vực mới (triển khai đầu tiên cùng nghề mới)
| Khu | Hoạt động / tương tác | Hiệu ứng và thưởng | Mở khóa |
|---|---|---|---|
| Chợ làng | `!mua`, `!ban`, like giúp khách mặc cả | mèo đặt quầy rau/cá/hoa, giao dịch và bảng tên người tài trợ quầy; điểm cộng đồng | Làng Lv2 |
| Thư viện / Trường mèo | `!doc`, `!hoc` | mèo con mở sách, chuông lớp học; 1 thẻ truyện mèo | Lv3 |
| Xưởng gỗ / Lò rèn nhỏ | `!dong`, góp gỗ | búa đóng bàn, bụi gỗ, khói; tăng tiến độ công trình | Lv4 |
| Vườn thảo dược / Nhà thuốc | `!chua`, hoa hồng hỗ trợ | mèo được chăm sóc, ngáp/hắt hơi dễ thương; huy hiệu Y tá làng | Lv5 |
| Sân khấu / Lễ hội | `!hat`, `!nhay`, quà lớn mở sân khấu | điệu nhảy, đèn, pháo hoa an toàn; clip và điểm tham dự | Lv6 |
| Bến thuyền / Hồ lớn | `!cau`, `!cheo` | thuyền chèo, bong bóng, đua thuyền; bộ sưu tập cá | Lv7 |
| Đồi hoa / Rừng tre | `!tham`, `!tim` | đi rừng, đom đóm, Mèo Vàng; thẻ khám phá | Lv8 |
| Khu mở rộng trang trí | `!trangtri` | cây, ghế, cờ, đèn lồng gắn tên đóng góp | Lv9–10 |
**Luật 3 dòng:** tham gia miễn phí → cộng điểm mục tiêu mở khóa → khi đủ, camera reveal khu và hiện Top 3 đóng góp. Khu mới cần có animated props ngay, không chỉ đặt mô hình tĩnh.

## B. Nghề, tính cách và quan hệ
| Mèo/Nghề | Người xem làm gì | Hình ảnh phải thấy | Phần thưởng |
|---|---|---|---|
| Thợ câu | `!cau`, `!giat` | thả cần, phao rung, kéo cá | 1/8 thẻ cá |
| Thợ làm bánh | `!banh` / quà bánh | nhào bột, lò sáng, bánh thành hình | 1/10 món ăn |
| Thợ may | `!may` | cắt vải, khâu, mặc áo mới | kiểu áo trang trí |
| Nhạc công | `!hat` | đàn, hát, có nhịp theo beat gốc | điểm văn nghệ |
| Gác đêm | `!gac` | đèn pin soi, đi tuần, xua cáo | an toàn |
| Đưa thư | `!thu` | ba lô, trao thư giữa mèo | lời nhắn/điểm |
| Mèo con học việc | `!sua` / quà sữa | đi theo mèo lớn, ngã nhẹ, học việc | thẻ mèo con |
| Tình bạn mèo | xem/mở trang truyện | gặp bạn thân bật tim, trêu nhau không bạo lực | collection kỷ niệm |
Tên/tính cách/sở thích/bạn thân là dữ liệu bền vững có chuyện kể. **Không ép mua quà để mèo con lớn**; lệnh miễn phí cũng có hiệu ứng.

## C. Chat / gift / like / follow
| Kích hoạt | Phản hồi trên màn hình trong 2 giây | Thưởng |
|---|---|---|
| `!an` | mèo ăn trong bát, thanh No tăng | điểm chăm sóc |
| `!vuot` | mèo gần nhất ngẩng đầu, vẫy đuôi | điểm thân thiết |
| `!hat` | mèo nhạc công hát, có phụ đề | điểm xã hội |
| `!nhay` | mèo nhảy, bụi sao | điểm vui |
| `!chup` | camera chụp một khung hình, thẻ kỷ niệm có tên | ảnh PNG tải ở máy LIVE (nếu có phép) |
| `!tham` | camera thăm nhà cư dân/ khu đã mở | gặp mèo mới |
| Hoa hồng | hoa + tên; trạng thái an toàn | 1/12 loại hoa |
| Giỏ cá | mèo ăn cá | No, điểm cá |
| Trà sữa | mèo uống trà tại quầy | trang phục/điểm vui |
| Bánh | bàn bánh xuất hiện, mở tiệc ngắn | thẻ món ăn |
| Pháo | bắn pháo hoa minh họa vào buổi tối | khoảnh khắc viral |
| Lồng đèn | đèn lồng ấm sáng với tên người tặng | trang trí |
| 500 like | một mèo nhảy lên | điểm vui |
| 1.000 like | mưa cá / tưới cây | 1 phần thưởng chung |
| 5.000 like | lễ hội mini | điểm + banner |
| Follow | trưởng làng ra đón và tăng “Khách mới hôm nay” | điểm/collection |
Giá TikTok do metadata **coin/diamond count** của sự kiện thực cung cấp. Rose thường 1 xu nhưng không hard-code giá kinh tế; combo khử trùng lặp, chống spam. Lệnh miễn phí không bị chặn bằng paywall.

## D. Mini-game / sự kiện
| Sự kiện | Người xem | Hiệu ứng trên màn | Thưởng / chu kỳ |
|---|---|---|---|
| Đua mèo | `!chon 1-6`, like cổ vũ | 6 mèo thi vòng làng, finish line | điểm dự đoán; mốc 15 phút hoặc slot major |
| Đua thuyền | `!thuyen 1-4` | 4 thuyền chạy, splash | điểm/ thẻ cá; mở bến |
| Thi câu cá | `cau`, `giat` | phao + cá đủ kích cỡ | vinh danh 5 phút |
| Thi hái hoa | `!hoa` | mèo đi vườn, nở hoa | hoa hiếm |
| Thi nấu ăn | `!mon`, chọn nguyên liệu miễn phí; quà là hiệu ứng thưởng | nấu trên chảo, bốc khói | thẻ món ăn |
| Rương bí ẩn | `!ruong` | mở rương, sáng + caption | vật phẩm trang trí, 10 phút/lần |
| Xổ số mèo | bình luận tham gia, không đòi quà | quay số công khai | chỉ điểm/thẻ ảo, không đổi tiền |
| Vòng quay hội | `!quay` | vòng xoay thời gian thực | thẻ/trang trí |
| Theo mùa: Tết, Trung Thu, Noel, Halloween | `!lehoi` | áo dài/lồng đèn/noel/hóa trang | huy hiệu theo mùa |
| Thời tiết | `!mua` trong event, free assist | mưa/sương/cầu vồng/tuyết, mèo trú/phơi | ảnh đẹp/điểm |
Luật mỗi mini-game: **tham gia bằng chat miễn phí → xem tiến độ/đếm ngược rõ ràng → có kết quả/vinh danh → giữ thành tích qua phiên**. Kết quả ngẫu nhiên không gắn giải thưởng có giá trị thật.

## E. Tiến trình làng và bộ sưu tập
- Lv1→10: cấp kinh nghiệm chung từ chat/like/nhiệm vụ; unlock A; banner 4 giây + 3 người góp hàng đầu, điểm đội không được tính trực tiếp từ số tiền tặng.
- Bộ sưu tập cá nhân: 20 mèo chính có chuyện, 12 hoa, 8 cá, 10 món ăn; huy hiệu hoàn thành set; tủ sách/album hiển thị trên panel khi mở, không hiện trên LIVE toàn thời gian.
- Thành tựu cộng đồng: 100 rau, 50 cá, 200 hoa, hiển thị khung tiến độ và đếm ngược; có hiệu ứng hoàn thành và danh hiệu cả phòng.
- Tiền làng = điểm game kiếm miễn phí từ nhiệm vụ; mua ghế/đèn/cờ; vật phẩm trên bản đồ gắn tên người góp nhưng không đảm bảo “chủ sở hữu” bằng token.
- Lưu theo tên tài khoản là bản mô phỏng không chống giả mạo; triển khai production dùng ID TikTok ổn định + backend, không lưu token TikTok.

## F. Âm thanh, cảm xúc, clip viral
| Tính năng | Điều khiển | Phản hồi nhìn/nghe | Mở khóa |
|---|---|---|---|
| Nhạc sáng/trưa/tối/đêm ASMR | tự đổi giờ; nút tắt/mở | nhạc gốc/được cấp phép + icon âm thanh | V1.2 polish |
| Ambience | cài đặt âm lượng | tiếng mèo, nước, gió, chuông tặng quà | V1.2 polish |
| Giọng Việt | bật voice | đọc tên quà/nhiệm vụ/truyện 30 phút, phụ đề | V1.2 polish |
| Biểu cảm mèo | tự phản hồi trạng thái làng | vui/buồn/đói/ngáp/ngủ/ngạc nhiên có face animation | V1.2 polish |
| Auto clip marker | sự kiện hiếm | caption 15 giây, highlight frame có tên ngày | V1.2 polish |
| Kỷ niệm chụp ảnh | `!chup` | zoom, đóng khung có tên, chụp Canvas | V1.2 polish |
Không tự hứa ghi video trực tiếp nếu browser không có API capture hoặc quyền OBS. Chỉ hỗ trợ gắn marker, caption và xuất ảnh khi được phép.

## G. Thứ tự triển khai và gates
1. **V1.1 phải pass trước:** HUD 3 đếm ngược/3 thanh/Top 3, loop 90s/5m/30m, hồ sơ/streak/20 mèo, bài test, CI và verify 9:16.
2. **V1.2-A:** Chợ, trường, xưởng + nghề và lệnh chat cơ bản, unlock theo level; mỗi khu có 3 animation riêng và vị trí camera.
3. **V1.2-B:** Mini-game + thời tiết + lễ hội; ít nhất 2 sự kiện nhìn thấy mỗi 5 phút.
4. **V1.2-C:** Tiến trình Lv1–10, bộ sưu tập 20/12/8/10, tiền làng/đồ trang trí.
5. **V1.2-D:** nhạc, SFX, biểu cảm và clip viral.

**Definition of done mỗi đợt:** `npm test` và `npm run build` pass, merge/push main, deploy Pages qua CI, xem bằng browser thật 5 phút (ảnh/screen recording), 20 mèo cư dân chính không đổi, mèo phụ có cap, 9:16 không overflow, FPS trung bình ≥30 trên thiết bị thử. Chưa đủ dữ liệu thì chỉ ghi “chưa nghiệm thu”.
