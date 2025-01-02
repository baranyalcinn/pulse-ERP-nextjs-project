// BOM Tipleri
export interface BSMGRPLEBOM001 {
  comcode: string;      // Şirket Kodu
  doctype: string;      // Döküman Tipi
  doctypetext: string;  // Döküman Tipi Açıklaması
  ispassive: number;    // Durum (0: Aktif, 1: Pasif)
}

// BOM Başlık
export interface BSMGRPLEBOMHEAD {
  comcode: string;      // Şirket Kodu
  doctype: string;      // Döküman Tipi
  docnum: string;      // Döküman Numarası
  docdate: Date;       // Döküman Tarihi
  matcode: string;     // Malzeme Kodu
  matdocnum: string;   // Malzeme Döküman Numarası
  unitcode: string;    // Birim Kodu
  ispassive: number;   // Durum
  createuser: string;  // Oluşturan Kullanıcı
  createdate: Date;    // Oluşturma Tarihi
  changeuser: string;  // Değiştiren Kullanıcı
  changedate: Date;    // Değiştirme Tarihi
}

// BOM İçerik
export interface BSMGRPLEBOMCONTENT {
  comcode: string;      // Şirket Kodu
  doctype: string;      // Döküman Tipi
  docnum: string;      // Döküman Numarası
  linenum: number;     // Satır Numarası
  matcode: string;     // Malzeme Kodu
  matdocnum: string;   // Malzeme Döküman Numarası
  unitcode: string;    // Birim Kodu
  quantity: number;    // Miktar
  scraprate: number;   // Fire Oranı
  ispassive: number;   // Durum
  createuser: string;  // Oluşturan Kullanıcı
  createdate: Date;    // Oluşturma Tarihi
  changeuser: string;  // Değiştiren Kullanıcı
  changedate: Date;    // Değiştirme Tarihi
}

export class BOMError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'BOMError';
    this.code = code;
    this.details = details;
  }
} 