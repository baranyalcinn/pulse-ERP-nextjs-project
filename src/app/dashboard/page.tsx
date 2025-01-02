'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FiUsers, FiGlobe, FiMapPin, FiBook, FiBox, FiLogOut, FiSettings, FiDatabase, FiActivity, FiPackage, FiDollarSign, FiList, FiTool, FiTrendingUp, FiPieChart, FiBarChart2, FiHeart, FiCpu, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { PulseAnimation } from '@/components/ui/PulseAnimation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  count?: number;
}

function MenuItem({ icon, title, description, href, count }: MenuItemProps) {
  const router = useRouter();

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-2xl hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group border border-gray-700/50"
      onClick={() => router.push(href)}
    >
      <div className="flex items-center space-x-4">
        <div className="text-blue-400 text-3xl group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
          {count !== undefined && (
            <div className="mt-2 text-sm text-blue-400 group-hover:text-blue-300">
              Toplam Kayıt: {count}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ModuleStats {
  material: number;
  cost: number;
  bom: number;
  route: number;
  general: number;
  workCenter: number;
  operation: number;
}

interface TableCount {
  general: number;
  material: number;
  cost: number;
  bom: number;
  route: number;
  workCenter: number;
  operation: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    companies: 0,
    countries: 0,
    cities: 0,
    languages: 0,
    units: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    material: 0,
    cost: 0,
    bom: 0,
    route: 0,
    general: 0,
    workCenter: 0,
    operation: 0
  });
  const [activityData, setActivityData] = useState<number[]>([]);
  const [dailyOperations, setDailyOperations] = useState<number[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.username);
    }

    async function fetchAllData() {
      try {
        setIsLoading(true);
        
        // Genel tanımlamalar sayıları
        const [
          { count: companiesCount },
          { count: countriesCount },
          { count: citiesCount },
          { count: languagesCount },
          { count: unitsCount }
        ] = await Promise.all([
          supabase.from('bsmgrplegen001').select('*', { count: 'exact' }),
          supabase.from('bsmgrplegen003').select('*', { count: 'exact' }),
          supabase.from('bsmgrplegen004').select('*', { count: 'exact' }),
          supabase.from('bsmgrplegen002').select('*', { count: 'exact' }),
          supabase.from('bsmgrplegen005').select('*', { count: 'exact' })
        ]);

        setCounts({
          companies: companiesCount || 0,
          countries: countriesCount || 0,
          cities: citiesCount || 0,
          languages: languagesCount || 0,
          units: unitsCount || 0
        });

        // Modül bazlı kayıt sayıları
        const [
          { count: materialCount },
          { count: costCount },
          { count: bomCount },
          { count: routeCount },
          { count: workCenterCount },
          { count: operationCount }
        ] = await Promise.all([
          supabase.from('bsmgrplemathead').select('*', { count: 'exact' }),
          supabase.from('bsmgrpleccmhead').select('*', { count: 'exact' }),
          supabase.from('bsmgrplebomhead').select('*', { count: 'exact' }),
          supabase.from('bsmgrplerothead').select('*', { count: 'exact' }),
          supabase.from('bsmgrplewcmhead').select('*', { count: 'exact' }),
          supabase.from('bsmgrpleopr001').select('*', { count: 'exact' })
        ]);

        const generalCount = (companiesCount || 0) + 
                           (countriesCount || 0) + 
                           (citiesCount || 0) + 
                           (languagesCount || 0) + 
                           (unitsCount || 0);

        setModuleStats({
          material: materialCount || 0,
          cost: costCount || 0,
          bom: bomCount || 0,
          route: routeCount || 0,
          general: generalCount,
          workCenter: workCenterCount || 0,
          operation: operationCount || 0
        });

        // Son 6 aylık aktivite verisi
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const { data: activityLogs } = await supabase
          .from('activity_logs')
          .select('created_at')
          .gte('created_at', sixMonthsAgo.toISOString())
          .order('created_at');

        // Aktivite verilerini aylara göre grupla
        const monthlyActivity = Array(6).fill(0);
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        
        activityLogs?.forEach(log => {
          const logDate = new Date(log.created_at);
          const monthIndex = logDate.getMonth();
          const monthDiff = new Date().getMonth() - monthIndex;
          if (monthDiff >= 0 && monthDiff < 6) {
            monthlyActivity[5 - monthDiff]++;
          }
        });

        setActivityData(monthlyActivity);

        // Son 5 günlük işlem sayıları
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const { data: recentOperations } = await supabase
          .from('activity_logs')
          .select('created_at')
          .gte('created_at', fiveDaysAgo.toISOString())
          .order('created_at');

        // İşlem verilerini günlere göre grupla
        const dailyOps = Array(5).fill(0);
        
        // Her bir işlemi ilgili güne ekle
        recentOperations?.forEach(op => {
          const date = new Date(op.created_at);
          const today = new Date();
          
          // Tarihleri gün başına normalize et
          date.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          
          // İki tarih arasındaki gün farkını hesapla
          const timeDiff = today.getTime() - date.getTime();
          const dayIndex = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
          
          if (dayIndex >= 0 && dayIndex < 5) {
            dailyOps[4 - dayIndex]++;
          }
        });

        setDailyOperations(dailyOps);

      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        toast.error('Veriler yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      Cookies.remove('auth_token');
      
      toast.success('Çıkış yapıldı');
      router.push('/auth/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  // Grafik verileri
  const lineChartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'].slice(-activityData.length),
    datasets: [
      {
        label: 'Sistem Aktivitesi',
        data: activityData,
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ['Malzeme', 'Maliyet Merkezi', 'Ürün Ağacı', 'Rota', 'Genel'],
    datasets: [
      {
        data: [
          moduleStats.material,
          moduleStats.cost,
          moduleStats.bom,
          moduleStats.route,
          moduleStats.general
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      },
    ],
  };

  const barChartData = {
    labels: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'].slice(-dailyOperations.length),
    datasets: [
      {
        label: 'Günlük İşlem Sayısı',
        data: dailyOperations,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(31, 41, 55, 0.2)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(31, 41, 55, 0.2)',
        },
      },
    },
  };

  // Tablo sayısını doğru hesapla
  const tableCount: TableCount = {
    general: ['bsmgrplegen001', 'bsmgrplegen002', 'bsmgrplegen003', 'bsmgrplegen004', 'bsmgrplegen005'].length,
    material: ['bsmgrplemat001', 'bsmgrplemathead', 'bsmgrplemattext'].length,
    cost: ['bsmgrpleccm001', 'bsmgrpleccmhead', 'bsmgrpleccmtext'].length,
    bom: ['bsmgrplebom001', 'bsmgrplebomhead', 'bsmgrplebomcontent'].length,
    route: ['bsmgrplerot001', 'bsmgrplerothead', 'bsmgrplerotbomcontent', 'bsmgrplerotoprcontent'].length,
    workCenter: ['bsmgrplewcm001', 'bsmgrplewcmhead', 'bsmgrplewcmtext'].length,
    operation: ['bsmgrpleopr001'].length
  };

  const tableValues = Object.values(tableCount).map(Number);
  const recordValues = Object.values(moduleStats).map(Number);

  const totalTables = tableValues.reduce((a, b) => a + b, 0);
  const totalRecords = recordValues.reduce((a, b) => a + b, 0);
  const maxProgress = 100;

  const getTableProgress = () => {
    const ratio = totalTables / 20;
    return ratio >= 1 ? maxProgress : ratio * maxProgress;
  };

  const getRecordProgress = () => {
    const ratio = totalRecords / 1000;
    return ratio >= 1 ? maxProgress : ratio * maxProgress;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900">
      {/* Animasyonlu Pulse Efekti */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-blue-500/5 rounded-full animate-pulse-slow"></div>
          <div className="absolute w-64 h-64 bg-purple-500/5 rounded-full animate-pulse-slower"></div>
          <div className="absolute w-32 h-32 bg-pink-500/5 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 relative">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 tracking-wider flex items-center">
                  <FiHeart className="mr-2 text-blue-400 animate-pulse" />
                  Pulse<span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">ERP</span>
                </h1>
                <p className="text-sm text-gray-400">Hoş geldiniz, {userName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => router.push('/settings')}
                className="flex items-center space-x-2 hover:bg-gray-700/50"
              >
                <FiSettings className="text-lg" />
                <span>Ayarlar</span>
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <FiLogOut className="text-lg" />
                <span>Çıkış Yap</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen"><PulseAnimation /></div>
        ) : (
          <div className="space-y-6">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Toplam Tablo"
                value={totalTables}
                icon={<FiDatabase className="text-3xl" />}
                progressValue={getTableProgress()}
                progressColor="bg-blue-400"
                iconColor="text-blue-400"
              />

              <StatCard
                title="Toplam Kayıt"
                value={totalRecords}
                icon={<FiActivity className="text-3xl" />}
                progressValue={getRecordProgress()}
                progressColor="bg-green-400"
                iconColor="text-green-400"
              />

              <StatCard
                title="Sistem Durumu"
                value={dailyOperations[dailyOperations.length - 1] > 0 ? 'Aktif' : 'Beklemede'}
                icon={<FiHeart className={`text-3xl ${dailyOperations[dailyOperations.length - 1] > 0 ? 'animate-pulse' : ''}`} />}
                progressValue={dailyOperations[dailyOperations.length - 1] > 0 ? 100 : 50}
                progressColor="bg-purple-400"
                iconColor="text-purple-400"
              />
            </div>

            {/* Modüller */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MenuItem
                icon={<FiSettings />}
                title="Genel Tanımlar"
                description="Şirket, dil, ülke, şehir ve birim tanımları"
                href="/general"
                count={moduleStats.general}
              />
              <MenuItem
                icon={<FiBox />}
                title="Malzeme Yönetimi"
                description="Malzeme tipleri, ana bilgileri ve açıklamaları"
                href="/material"
                count={moduleStats.material}
              />
              <MenuItem
                icon={<FiDollarSign />}
                title="Maliyet Merkezi"
                description="Maliyet merkezi tipleri, ana bilgileri ve açıklamaları"
                href="/cost"
                count={moduleStats.cost}
              />
              <MenuItem
                icon={<FiList />}
                title="Ürün Ağacı"
                description="Ürün ağacı tipleri, ana bilgileri ve içerikleri"
                href="/bom"
                count={moduleStats.bom}
              />
              <MenuItem
                icon={<FiTool />}
                title="Rota"
                description="Rota tipleri, ana bilgileri ve operasyonları"
                href="/route"
                count={moduleStats.route}
              />
              <MenuItem
                icon={<FiCpu />}
                title="İş Merkezi"
                description="İş merkezi tipleri, ana bilgileri ve operasyonları"
                href="/work-center"
                count={moduleStats.workCenter}
              />
              <MenuItem
                icon={<FiActivity />}
                title="Operasyon"
                description="Operasyon tipleri ve tanımları"
                href="/operation"
                count={moduleStats.operation}
              />
            </div>

            {/* Gelişmiş İstatistikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                title="Sistem Aktivitesi"
                icon={<FiTrendingUp />}
                iconColor="text-blue-400"
              >
                <Line data={lineChartData} options={chartOptions} />
              </ChartCard>

              <ChartCard
                title="Modül Kullanım Dağılımı"
                icon={<FiPieChart />}
                iconColor="text-purple-400"
              >
                <Pie data={pieChartData} options={chartOptions} />
              </ChartCard>

              <ChartCard
                title="Günlük İşlem Analizi"
                icon={<FiBarChart2 />}
                iconColor="text-green-400"
                className="col-span-full"
              >
                <Bar data={barChartData} options={chartOptions} />
              </ChartCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 