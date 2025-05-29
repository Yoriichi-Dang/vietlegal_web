import type { MessageAttachment } from "@/components/chat/message/types";

export interface SeedMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  experimental_attachments?: MessageAttachment[];
  timestamp: Date;
}

export const chatSeedData: SeedMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Xin chào! Tôi cần tư vấn về luật thuế mới nhất cho doanh nghiệp.",
    timestamp: new Date("2024-01-20T09:00:00Z"),
  },
  {
    id: "msg-2",
    role: "assistant",
    content: `Xin chào! Tôi rất vui được hỗ trợ bạn về **luật thuế doanh nghiệp**. 

## Những thay đổi quan trọng trong luật thuế 2024:

### 1. Thuế thu nhập doanh nghiệp
- Mức thuế suất chuẩn: **20%**
- Ưu đãi cho doanh nghiệp nhỏ và vừa: **17%**
- Doanh nghiệp công nghệ cao: **10%** trong 15 năm đầu

### 2. Khấu trừ thuế GTGT
> Từ 2024, doanh nghiệp được khấu trừ 100% thuế GTGT đầu vào cho các khoản chi phí hợp lý.

### 3. Quy định mới về hóa đơn điện tử
- **Bắt buộc** sử dụng hóa đơn điện tử từ 01/07/2024
- Tích hợp với hệ thống thuế điện tử

Bạn có câu hỏi cụ thể nào về thuế doanh nghiệp không?`,
    timestamp: new Date("2024-01-20T09:01:30Z"),
  },
  {
    id: "msg-3",
    role: "user",
    content:
      "Tôi có một số tài liệu cần phân tích. Đây là báo cáo tài chính và hợp đồng bảo hiểm của công ty.",
    experimental_attachments: [
      {
        name: "bao-cao-tai-chinh-q4-2023.xlsx",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "/placeholder.svg?height=400&width=600&text=Excel+File",
      },
      {
        name: "hop-dong-bao-hiem-doanh-nghiep.pdf",
        contentType: "application/pdf",
        url: "/placeholder.svg?height=400&width=600&text=PDF+Document",
      },
      {
        name: "bien-lai-thue-thang-12.jpg",
        contentType: "image/jpeg",
        url: "/placeholder.svg?height=400&width=600&text=Receipt+Image",
      },
    ],
    timestamp: new Date("2024-01-20T09:05:00Z"),
  },
  {
    id: "msg-4",
    role: "assistant",
    content: `Cảm ơn bạn đã cung cấp tài liệu! Tôi đã xem qua các file:

## Phân tích tài liệu:

### 📊 Báo cáo tài chính Q4/2023
- **Doanh thu**: Tăng 15% so với cùng kỳ
- **Lợi nhuận**: Đạt 2.3 tỷ VNĐ
- **Thuế phải nộp**: ~460 triệu VNĐ (20% thuế TNDN)

### 📋 Hợp đồng bảo hiểm doanh nghiệp
- **Loại bảo hiểm**: Trách nhiệm nghề nghiệp
- **Mức bảo hiểm**: 5 tỷ VNĐ
- **Phí bảo hiểm**: 50 triệu VNĐ/năm
- ✅ **Được khấu trừ** thuế TNDN

### 🧾 Biên lai thuế tháng 12
- **Thuế GTGT**: 180 triệu VNĐ
- **Thuế TNDN tạm nộp**: 120 triệu VNĐ
- **Trạng thái**: Đã nộp đầy đủ

## Khuyến nghị:

\`\`\`
1. Kê khai thuế TNDN năm 2023 trước 31/03/2024
2. Chuẩn bị hồ sơ khấu trừ phí bảo hiểm
3. Đối chiếu số thuế đã nộp với số phải nộp
\`\`\`

Bạn có cần tôi giải thích thêm về quy trình kê khai không?`,
    timestamp: new Date("2024-01-20T09:08:45Z"),
  },
  {
    id: "msg-5",
    role: "user",
    content:
      "Có thể giải thích chi tiết về quy trình kê khai thuế TNDN không? Và cho tôi xem video hướng dẫn nếu có.",
    experimental_attachments: [
      {
        name: "huong-dan-ke-khai-thue-tndn.mp4",
        contentType: "video/mp4",
        url: "/placeholder.svg?height=300&width=500&text=Video+Tutorial",
      },
    ],
    timestamp: new Date("2024-01-20T09:10:00Z"),
  },
  {
    id: "msg-6",
    role: "assistant",
    content: `## Quy trình kê khai thuế TNDN chi tiết

### Bước 1: Chuẩn bị hồ sơ 📋
- Báo cáo tài chính đã kiểm toán
- Bảng kê chi tiết các khoản thu nhập
- Chứng từ các khoản chi phí được trừ
- Hợp đồng, hóa đơn liên quan

### Bước 2: Tính toán thuế phải nộp 💰

| Khoản mục | Công thức | Ghi chú |
|-----------|-----------|---------|
| Thu nhập chịu thuế | Doanh thu - Chi phí hợp lý | Theo quy định |
| Thuế phải nộp | Thu nhập × 20% | Mức thuế chuẩn |
| Thuế được miễn giảm | Theo ưu đãi | Nếu có |

### Bước 3: Nộp hồ sơ 📤
1. **Trực tuyến**: Qua cổng dịch vụ công quốc gia
2. **Trực tiếp**: Tại cơ quan thuế
3. **Qua đại lý**: Dịch vụ kế toán

### Thời hạn quan trọng ⏰
- **Kê khai**: Trước 31/03 hàng năm
- **Nộp thuế**: Cùng thời hạn kê khai
- **Phạt chậm nộp**: 0.03%/ngày

> **Lưu ý**: Video hướng dẫn ở trên sẽ giúp bạn hiểu rõ hơn về từng bước thực hiện.

### Code mẫu tính thuế:
\`\`\`javascript
function tinhThueTNDN(doanhThu, chiPhi, uuDai = 0) {
  const thuNhapChiuThue = doanhThu - chiPhi;
  const thueSuat = 0.20; // 20%
  const thuePhaiNop = thuNhapChiuThue * thueSuat - uuDai;
  return Math.max(0, thuePhaiNop);
}

// Ví dụ:
const thue = tinhThueTNDN(10000000000, 8000000000, 50000000);
console.log("Thuế phải nộp:", thue.toLocaleString('vi-VN'), "VNĐ");
\`\`\`

Bạn có muốn tôi hướng dẫn cụ thể cho trường hợp của công ty bạn không?`,
    timestamp: new Date("2024-01-20T09:15:30Z"),
  },
  {
    id: "msg-7",
    role: "user",
    content:
      "Cảm ơn bạn! Thông tin rất hữu ích. Tôi sẽ chuẩn bị hồ sơ theo hướng dẫn.",
    timestamp: new Date("2024-01-20T09:18:00Z"),
  },
  {
    id: "msg-8",
    role: "assistant",
    content: `Rất vui được giúp đỡ bạn! 🎉

## Tóm tắt những điều cần nhớ:

### ✅ Checklist chuẩn bị:
- [ ] Báo cáo tài chính Q4/2023
- [ ] Chứng từ chi phí hợp lý  
- [ ] Hợp đồng bảo hiểm (để khấu trừ)
- [ ] Kiểm tra số thuế đã tạm nộp

### 📅 Lịch trình:
- **Bây giờ - 15/03**: Chuẩn bị hồ sơ
- **15/03 - 30/03**: Kê khai và nộp thuế
- **Sau 31/03**: Theo dõi xử lý hồ sơ

### 🆘 Hỗ trợ thêm:
Nếu bạn cần hỗ trợ thêm về:
- Tính toán thuế cụ thể
- Chuẩn bị hồ sơ chi tiết  
- Quy trình nộp trực tuyến
- Xử lý các trường hợp đặc biệt

Hãy liên hệ lại với tôi bất cứ lúc nào! Chúc bạn hoàn thành thủ tục thuế thuận lợi! 💪`,
    timestamp: new Date("2024-01-20T09:20:15Z"),
  },
];

// Template messages cho các tình huống khác nhau
export const templateMessages = {
  // Tin nhắn với ảnh
  imageMessage: {
    id: "img-msg",
    role: "user" as const,
    content: "Đây là ảnh hợp đồng tôi cần phân tích",
    experimental_attachments: [
      {
        name: "hop-dong-lao-dong.jpg",
        contentType: "image/jpeg",
        url: "/placeholder.svg?height=600&width=800&text=Contract+Image",
      },
    ],
    timestamp: new Date(),
  },

  // Tin nhắn với nhiều file
  multiFileMessage: {
    id: "multi-msg",
    role: "user" as const,
    content: "Tôi gửi đầy đủ hồ sơ để bạn xem xét",
    experimental_attachments: [
      {
        name: "giay-phep-kinh-doanh.pdf",
        contentType: "application/pdf",
        url: "/placeholder.svg?height=400&width=600&text=Business+License",
      },
      {
        name: "bang-luong-nhan-vien.xlsx",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        url: "/placeholder.svg?height=400&width=600&text=Payroll+Sheet",
      },
      {
        name: "anh-van-phong.jpg",
        contentType: "image/jpeg",
        url: "/placeholder.svg?height=400&width=600&text=Office+Photo",
      },
      {
        name: "video-gioi-thieu.mp4",
        contentType: "video/mp4",
        url: "/placeholder.svg?height=300&width=500&text=Company+Video",
      },
    ],
    timestamp: new Date(),
  },

  // Tin nhắn markdown phức tạp
  complexMarkdownMessage: {
    id: "md-msg",
    role: "assistant" as const,
    content: `# Phân tích toàn diện về luật bảo hiểm xã hội

## 1. Tổng quan về BHXH 🏢

Bảo hiểm xã hội là một trong những **trụ cột quan trọng** của hệ thống an sinh xã hội tại Việt Nam.

### Các loại bảo hiểm bắt buộc:
1. **BHXH** - Bảo hiểm xã hội
2. **BHYT** - Bảo hiểm y tế  
3. **BHTN** - Bảo hiểm thất nghiệp

## 2. Mức đóng BHXH năm 2024 💰

| Loại BH | Người lao động | Người sử dụng lao động | Tổng |
|---------|----------------|-------------------------|-------|
| BHXH | 8% | 17.5% | 25.5% |
| BHYT | 1.5% | 3% | 4.5% |
| BHTN | 1% | 1% | 2% |
| **Tổng** | **10.5%** | **21.5%** | **32%** |

## 3. Quyền lợi của người tham gia 🎯

### Chế độ ốm đau:
- Nghỉ ốm **1-30 ngày**: 75% lương
- Nghỉ ốm **trên 30 ngày**: 100% lương

### Chế độ thai sản:
> Nữ lao động được nghỉ **6 tháng** với 100% lương

### Chế độ hưu trí:
- **Nam**: 62 tuổi, đóng đủ 20 năm
- **Nữ**: 60 tuổi, đóng đủ 20 năm

## 4. Cách tính lương hưu 📊

\`\`\`
Lương hưu = Mức lương cơ sở × Tỷ lệ hưu × Hệ số điều chỉnh
\`\`\`

### Ví dụ tính toán:
\`\`\`javascript
function tinhLuongHuu(namDong, luongBinhQuan) {
  const tyLeHuu = Math.min(45 + (namDong - 15) * 2, 75); // Tối đa 75%
  const luongHuu = luongBinhQuan * (tyLeHuu / 100);
  return luongHuu;
}

// Ví dụ: 25 năm đóng, lương bình quân 8 triệu
const luongHuu = tinhLuongHuu(25, 8000000);
console.log("Lương hưu:", luongHuu.toLocaleString('vi-VN'), "VNĐ");
\`\`\`

## 5. Thủ tục quan trọng 📋

### Khi bắt đầu làm việc:
1. Đăng ký tham gia BHXH
2. Cấp sổ BHXH
3. Đóng BHXH hàng tháng

### Khi nghỉ việc:
1. Tạm dừng đóng BHXH
2. Bảo quản sổ BHXH
3. Chuyển BHXH (nếu cần)

---

> **Lưu ý quan trọng**: Luôn đóng BHXH đầy đủ và đúng hạn để đảm bảo quyền lợi tốt nhất!

Bạn có câu hỏi gì về BHXH không? 🤔`,
    timestamp: new Date(),
  },
};

// Utility function để thêm tin nhắn mới
export function createMessage(
  role: "user" | "assistant" | "system",
  content: string,
  attachments?: MessageAttachment[]
): SeedMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role,
    content,
    experimental_attachments: attachments,
    timestamp: new Date(),
  };
}

// Utility function để tạo attachment
export function createAttachment(
  name: string,
  contentType: string,
  url?: string
): MessageAttachment {
  return {
    name,
    contentType,
    url:
      url ||
      `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(name)}`,
  };
}
