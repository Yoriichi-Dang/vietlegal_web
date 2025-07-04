# AI Interface Demo

## Cách test Research & Thinking Interface

### 1. Sử dụng Demo Page

- **Research Demo**: `http://localhost:3000/research-demo`
- **Thinking Demo**: `http://localhost:3000/thinking-demo`
- Click "Bắt đầu Demo" để xem interface hoạt động

### 2. Sử dụng trong Chat Interface

- Truy cập trang chat chính
- Click nút "Research Demo" hoặc "Thinking Demo" ở góc phải trên (chỉ hiển thị trên desktop)
  - Hoặc nhập tin nhắn:
    - **Research triggers**: "nghiên cứu", "research", "luật", "thuế", "báo cáo", "demo"
    - **Thinking triggers**: Bất kỳ câu hỏi nào khác (mặc định)

### 3. Tính năng Research Interface

#### Panel Trái (30% width):

- Loading animation với icon xoay
- Progress bar hiển thị tiến độ
- Thông báo trạng thái research

#### Panel Phải (70% width):

- Grid 2 cột hiển thị sources
- Mỗi source card có:
  - Icon domain
  - Tiêu đề (truncated)
  - Domain name
  - Status indicator (pending/researching/completed)
- Animation fade-in theo thứ tự
- Summary section xuất hiện khi progress > 80%

### 4. Tính năng Thinking Interface

#### Panel Trái (40% width):

- Brain icon với animation xoay và scale
- Progress bar theo màu purple-pink gradient
- Thông báo trạng thái thinking
- Hiển thị mô tả step hiện tại

#### Panel Phải (60% width):

- Danh sách 5 bước thinking theo thứ tự:
  1. **Phân tích câu hỏi** - Brain icon
  2. **Tìm kiếm tài liệu** - Search icon
  3. **Xử lý thông tin** - FileText icon
  4. **Tổng hợp kết quả** - Sparkles icon
  5. **Hoàn thành** - Check icon
- Mỗi step có trạng thái: pending → processing → completed
- Processing step có dots animation
- Adaptive descriptions dựa trên từ khóa câu hỏi
- Preview section hiển thị khi progress > 80%

### 5. Seed Data

Interface sử dụng 22 mock sources với các domain thực tế của Việt Nam:

- congbao.vn (Công báo)
- thuvienphapluat.vn (Thư viện pháp luật)
- vbpl.vn (Văn bản pháp luật)
- mof.gov.vn (Bộ Tài chính)
- pwc.com.vn (PWC)
- einvoice.vn (Hóa đơn điện tử)
- xaydung.gov.vn (Bộ Xây dựng)
- htpldin.vn (Học viện Tài chính)
- laodon.vn (Lao động)
- quochoi.vn (Quốc hội)

### 6. Animation Details

- **Research**: Progress tăng ngẫu nhiên từ 1-4% mỗi 400ms, source cards fade-in
- **Thinking**: Sequential step execution với timing realistic
- Rotating icon animations
- Smooth transitions và progress bars
- Auto complete sau khi đạt 100%
- Summary/Preview sections với fade-in effect

### 7. Timing & Duration

- **Research**: ~8-12 giây (simulation)
- **Thinking**: ~7-9 giây (5 steps với duration khác nhau)
  - Phân tích: 1.5s
  - Tìm kiếm: 2.0s
  - Xử lý: 1.8s
  - Tổng hợp: 1.2s
  - Hoàn thành: 0.5s

### 8. Adaptive Content

- **Thinking descriptions** thay đổi dựa trên từ khóa:
  - Legal keywords → "tìm kiếm trong cơ sở dữ liệu pháp luật"
  - Analysis keywords → "phân tích và so sánh các nguồn"
  - Default → generic descriptions

### 9. Responsive Design

- Desktop: Full layout với split panels
- Mobile: Responsive grid và typography
- Custom scrollbar styling
