// Şirket bilgileri
export interface BSMGRPLEGEN001 {
  comcode: string;
  comtext: string;
  address1: string;
  address2?: string;
  citycode: string;
  countrycode: string;
}

// Dil bilgileri
export interface BSMGRPLEGEN002 {
  comcode: string;
  lancode: string;
  lantext: string;
}

// Ülke bilgileri
export interface BSMGRPLEGEN003 {
  comcode: string;
  countrycode: string;
  countrytext: string;
}

// Şehir bilgileri
export interface BSMGRPLEGEN004 {
  comcode: string;
  citycode: string;
  citytext: string;
  countrycode: string;
}

// Birim bilgileri
export interface BSMGRPLEGEN005 {
  comcode: string;
  unitcode: string;
  unittext: string;
  ismainunit: number;
  mainunitcode: string;
}

// Malzeme Tipleri
export interface BSMGRPLEMAT001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
}

// Malzeme Ana Bilgileri
export interface BSMGRPLEMATHEAD {
  comcode: string;
  matdoctype: string;
  matdocnum: string;
  matdocfrom: string; // date
  matdocuntil: string; // date
  supplytype: number;
  stunit: string;
  netweight: number;
  nwunit: string;
  brutweight: number;
  bwunit: string;
  isbom: number;
  bomdoctype: string;
  bomdocnum: string;
  isroute: number;
  rotdoctype: string;
  rotdocnum: string;
  isdeleted: number;
  ispassive: number;
}

// Malzeme Açıklamaları
export interface BSMGRPLEMATTEXT {
  comcode: string;
  matdoctype: string;
  matdocnum: string;
  matdocfrom: string; // date
  matdocuntil: string; // date
  lancode: string;
  matstext: string;
  matltext: string;
}

// Maliyet Merkezi Tipleri
export interface BSMGRPLECCM001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
}

// Maliyet Merkezi Ana Bilgileri
export interface BSMGRPLECCMHEAD {
  comcode: string;
  ccmdoctype: string;
  ccmdocnum: string;
  ccmdocfrom: string; // date
  ccmdocuntil: string; // date
  mainccmdoctype: string;
  mainccmdocnum: string;
  isdeleted: number;
  ispassive: number;
}

// Maliyet Merkezi Açıklamaları
export interface BSMGRPLECCMTEXT {
  comcode: string;
  ccmdoctype: string;
  ccmdocnum: string;
  ccmdocfrom: string; // date
  ccmdocuntil: string; // date
  lancode: string;
  ccmstext: string;
  ccmltext: string;
}

export interface BSMGRPLEROT001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
}

export interface BSMGRPLEROTHEAD {
  comcode: string;
  rotdoctype: string;
  rotdocnum: string;
  rotdocfrom: string;
  rotdocuntil: string;
  matdoctype: string;
  matdocnum: string;
  quantity: number;
  isdeleted: number;
  ispassive: number;
  drawnum: string;
}

export interface BSMGRPLEROTBOMCONTENT {
  comcode: string;
  rotdoctype: string;
  rotdocnum: string;
  rotdocfrom: string;
  rotdocuntil: string;
  matdoctype: string;
  matdocnum: string;
  oprnum: number;
  bomdoctype: string;
  bomdocnum: string;
  contentnum: number;
  component: string;
  quantity: number;
}

export interface BSMGRPLEROTOPRCONTENT {
  comcode: string;
  rotdoctype: string;
  rotdocnum: string;
  bomdocfrom: string;
  bomdocuntil: string;
  matdoctype: string;
  matdocnum: string;
  oprnum: number;
  wcmdoctype: string;
  wcmdocnum: string;
  oprdoctype: string;
  setuptime: number;
  machinetime: number;
  labourtime: number;
}

// İş Merkezi Tipleri
export interface BSMGRPLEWCM001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
}

// İş Merkezi Ana Bilgileri
export interface BSMGRPLEWCMHEAD {
  comcode: string;
  wcmdoctype: string;
  wcmdocnum: string;
  wcmdocfrom: string; // date
  wcmdocuntil: string; // date
  mainwcmdoctype: string;
  mainwcmdocnum: string;
  ccmdoctype: string;
  ccmdocnum: string;
  worktime: number;
  isdeleted: number;
  ispassive: number;
}

// İş Merkezi Operasyonları
export interface BSMGRPLEWCMOPR {
  comcode: string;
  wcmdoctype: string;
  wcmdocnum: string;
  wcmdocfrom: string; // date
  wcmdocuntil: string; // date
  oprdoctype: string;
}

// İş Merkezi Açıklamaları
export interface BSMGRPLEWCMTEXT {
  comcode: string;
  wcmdoctype: string;
  wcmdocnum: string;
  wcmdocfrom: string; // date
  wcmdocuntil: string; // date
  lancode: string;
  wcmstext: string;
  wcmltext: string;
}

// Operasyon Modülü Tipleri
export interface BSMGRPLEOPR001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
}

export class GeneralError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeneralError';
  }
} 