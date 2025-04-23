import { useState, useEffect } from "react";

export function useWindowSize() {
  // Khởi tạo với giá trị mặc định
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // Chỉ cập nhật state sau khi component đã mount
  useEffect(() => {
    // Cập nhật state với kích thước cửa sổ thực tế
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Thêm event listener
    window.addEventListener("resize", handleResize);

    // Gọi handleResize để đặt giá trị ban đầu
    handleResize();

    // Cleanup: xóa event listener khi component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
