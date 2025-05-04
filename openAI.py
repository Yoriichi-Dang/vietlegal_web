from openai import OpenAI
client = OpenAI(api_key="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")

stream = client.responses.create(
    model="gpt-4.1",
    input=[
        {
            "role": "user",
            "content": "Introduce yourself",
        },
    ],
    stream=True,
)

# Xử lý các event khác nhau
full_response = ""
for event in stream:
    # Xử lý event theo loại
    if event.type == 'response.output_text.delta':
        # Đây là delta text - phần văn bản được thêm vào
        text_chunk = event.delta
        full_response += text_chunk
        print(text_chunk, end="", flush=True)  # In từng phần nhỏ
    elif event.type == 'response.completed':
        print("\n[Phản hồi đã hoàn thành]")
    elif event.type == 'response.created':
        print("\n[Bắt đầu tạo phản hồi]")
    elif event.type == 'response.in_progress':
        pass  # Có thể bỏ qua hoặc hiển thị thông báo đang xử lý
    elif event.type == 'response.output_item.added':
        pass  # Có thể bỏ qua
    elif event.type == 'response.content_part.added':
        pass  # Có thể bỏ qua

print("\n\nPhản hồi đầy đủ:")
print(full_response)