/**
 * Mock Events Data
 * Dùng cho development trước khi connect Supabase
 */

export interface MockEvent {
  id: string;
  title: string;
  category: 'music' | 'art' | 'sports' | 'tech' | 'food' | 'health' | 'gaming' | 'cinema';
  categoryLabel: string;
  location: string;
  date: string;
  image: string;
  price: {
    min: number;
    max: number;
    original?: number;
  };
  discount?: number;
  description: string;
  available: boolean;
}

export const mockEvents: MockEvent[] = [
  {
    id: '1',
    title: 'Triển lãm "Sắc thái Tương lai"',
    category: 'art',
    categoryLabel: 'Nghệ thuật',
    location: 'Trung tâm Triển lãm Quốc gia',
    date: '25 Tháng 7',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=400&fit=crop',
    price: {
      min: 350000,
      max: 550000,
      original: 550000,
    },
    discount: 0,
    description: 'Khám phá những tác phẩm nghệ thuật tương lai đầy sáng tạo',
    available: true,
  },
  {
    id: '2',
    title: 'Đêm nhạc Jazz: Midnight Soul',
    category: 'music',
    categoryLabel: 'Âm nhạc',
    location: 'The Blue Note Club',
    date: '28 Tháng 7',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=400&fit=crop',
    price: {
      min: 300000,
      max: 350000,
      original: 350000,
    },
    discount: 0,
    description: 'Trải nghiệm đêm nhạc Jazz cổ điển tại Blue Note Club',
    available: true,
  },
  {
    id: '3',
    title: 'Hội thảo AI & Metaverse 2024',
    category: 'tech',
    categoryLabel: 'Công nghệ',
    location: 'Lotte Center Hà Nội',
    date: '05 Tháng 8',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=400&fit=crop',
    price: {
      min: 0,
      max: 0,
    },
    discount: 0,
    description: 'Hội thảo lớn về AI, Machine Learning và Metaverse',
    available: true,
  },
  {
    id: '4',
    title: 'V-Pop Summer Wave',
    category: 'music',
    categoryLabel: 'Âm nhạc',
    location: 'SVĐ Mỹ Đình',
    date: '05 Tháng 8',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop',
    price: {
      min: 840000,
      max: 1200000,
      original: 1200000,
    },
    discount: 30,
    description: 'Lễ hội âm nhạc V-Pop lớn nhất mùa hè',
    available: true,
  },
  {
    id: '5',
    title: 'Workshop Gốm Thủ Công',
    category: 'art',
    categoryLabel: 'Nghệ thuật',
    location: 'Pottery Haven',
    date: 'Hàng tuần',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&h=400&fit=crop',
    price: {
      min: 250000,
      max: 500000,
      original: 500000,
    },
    discount: 50,
    description: 'Học cách làm gốm thủ công từ các thợ thủ công chuyên nghiệp',
    available: true,
  },
  {
    id: '6',
    title: 'Đêm Hài Độc Thoại',
    category: 'music',
    categoryLabel: 'Âm nhạc',
    location: 'Saigon Laughs',
    date: 'Thứ 6',
    image: 'https://images.unsplash.com/photo-1584464694267-37b03d10a767?w=500&h=400&fit=crop',
    price: {
      min: 160000,
      max: 200000,
      original: 200000,
    },
    discount: 20,
    description: 'Đêm hài độc thoại với những nghệ sĩ hài nổi tiếng',
    available: true,
  },
  {
    id: '7',
    title: 'Lớp học Nấu ăn Ý',
    category: 'food',
    categoryLabel: 'Ẩm thực',
    location: 'Chef Academy Hanoi',
    date: '25 Tháng 7',
    image: 'https://images.unsplash.com/photo-1556910103-2b02b5ce8e6f?w=500&h=400&fit=crop',
    price: {
      min: 900000,
      max: 900000,
    },
    discount: 0,
    description: 'Lớp học nấu ăn Ý chính thức cùng đầu bếp nổi tiếng',
    available: true,
  },
  {
    id: '8',
    title: 'Yoga Bình minh',
    category: 'health',
    categoryLabel: 'Sức khỏe',
    location: 'Green Park',
    date: 'Hàng ngày',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=400&fit=crop',
    price: {
      min: 0,
      max: 0,
    },
    discount: 0,
    description: 'Lớp yoga buổi sáng tại công viên yên tĩnh',
    available: true,
  },
  {
    id: '9',
    title: 'E-Sports Championship',
    category: 'gaming',
    categoryLabel: 'Gaming',
    location: 'Esports Arena Hanoi',
    date: '12 Tháng 8',
    image: 'https://images.unsplash.com/photo-1531492454716-8e0ea0e4f1a0?w=500&h=400&fit=crop',
    price: {
      min: 200000,
      max: 500000,
    },
    discount: 0,
    description: 'Giải đấu E-Sports hàng đầu với giải thưởng lớn',
    available: true,
  },
  {
    id: '10',
    title: 'Cinema Under The Stars',
    category: 'cinema',
    categoryLabel: 'Phim ảnh',
    location: 'Outdoor Park',
    date: 'Thứ 7',
    image: 'https://images.unsplash.com/photo-1489599849228-bed96c3fcf30?w=500&h=400&fit=crop',
    price: {
      min: 150000,
      max: 150000,
    },
    discount: 0,
    description: 'Xem phim ngoài trời dưới ánh sao đêm',
    available: true,
  },
  {
    id: '11',
    title: 'Lễ hội Ánh sáng & Âm nhạc Digital 2024',
    category: 'music',
    categoryLabel: 'Âm nhạc',
    location: 'Digital Festival Ground',
    date: '20 Tháng 12',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=400&fit=crop',
    price: {
      min: 500000,
      max: 1500000,
    },
    discount: 0,
    description: 'Lễ hội âm nhạc điện tử lớn nhất năm với các DJ quốc tế',
    available: true,
  },
  {
    id: '12',
    title: 'Marathon Hà Nội 2024',
    category: 'sports',
    categoryLabel: 'Thể thao',
    location: 'Hoàn Kiếm Lake',
    date: '10 Tháng 10',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop',
    price: {
      min: 300000,
      max: 500000,
    },
    discount: 0,
    description: 'Cuộc chạy marathon quốc tế tại hồ Hoàn Kiếm',
    available: true,
  },
];
