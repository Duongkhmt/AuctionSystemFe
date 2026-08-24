/**
 * ====================================================================================
 * 🔄 CASE CONVERTER UTIL (Hàm Tiện Ích Chuyển Đổi Định Dạng Tên Trường Nền Tảng)
 * ====================================================================================
 * Chuyển đổi đệ quy tất cả các key thuộc tính trong JSON Object hoặc Mảng từ định dạng
 * `snake_case` của Spring Boot (ví dụ: `winning_price`, `product_title`, `created_at`)
 * sang chuẩn `camelCase` của Angular TypeScript Interfaces (thành `winningPrice`, `productTitle`, `createdAt`),
 * và ngược lại từ `camelCase` sang `snake_case` khi gửi request sang Backend.
 */
export function snakeToCamelKeys<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamelKeys(v)) as any;
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = snakeToCamelKeys(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export function camelToSnakeKeys<T = any>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelToSnakeKeys(v)) as any;
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = camelToSnakeKeys(obj[key]);
      return result;
    }, {});
  }
  return obj;
}
