import React from 'react';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  category: 'main' | 'auxiliary';
}

export const TableIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

export const dashboardCards: DashboardCard[] = [
  {
    id: 'bom',
    title: 'BOM Yönetimi',
    description: 'Şirket kodu, döküman tipi ve durum bilgilerini içeren BOM kayıtlarını yönetin',
    icon: <TableIcon />,
    href: '/bom',
    category: 'main',
  },
  {
    id: 'bom-content',
    title: 'BOM İçerik Yönetimi',
    description: 'BOM içeriklerini, bileşenlerini ve miktarlarını yönetin',
    icon: <TableIcon />,
    href: '/bom-content',
    category: 'main',
  },
  {
    id: 'bom-header',
    title: 'BOM Header Yönetimi',
    description: 'BOM başlık bilgilerini, tarihlerini ve miktarlarını yönetin',
    icon: <TableIcon />,
    href: '/bom-header',
    category: 'main',
  },
  {
    id: 'ccm',
    title: 'CCM Yönetimi',
    description: 'Şirket kodu, döküman tipi ve durum bilgilerini içeren CCM kayıtlarını yönetin',
    icon: <TableIcon />,
    href: '/ccm',
    category: 'main',
  },
  {
    id: 'ccm-head',
    title: 'CCM Header Yönetimi',
    description: 'CCM başlık bilgilerini, tarihlerini ve bağlantılarını yönetin',
    icon: <TableIcon />,
    href: '/ccm-head',
    category: 'main',
  },
  {
    id: 'ccm-text',
    title: 'CCM Metin Yönetimi',
    description: 'CCM metinlerini ve çevirilerini yönetin',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    href: '/ccm-text',
    category: 'main',
  }
]; 