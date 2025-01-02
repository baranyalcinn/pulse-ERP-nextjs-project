'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from './Button';
import { FiArrowLeft } from 'react-icons/fi';

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const getParentPath = () => {
    // URL'yi parçalara ayır
    const parts = pathname?.split('/').filter(Boolean);
    
    if (!parts || parts.length <= 1) {
      return '/'; // Ana sayfaya dön
    }

    // Son parçayı kaldır ve geri kalan yolu oluştur
    parts.pop();
    return `/${parts.join('/')}`;
  };

  return (
    <Button
      variant="secondary"
      onClick={() => router.push(getParentPath())}
      className="flex items-center space-x-2"
    >
      <FiArrowLeft className="text-lg" />
      <span>Geri</span>
    </Button>
  );
}