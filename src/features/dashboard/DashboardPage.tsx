import { useMemo } from 'react';
import {
  Package,
  Wallet,
  AlertOctagon,
  Clock,
  PackageMinus,
  type LucideIcon,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useInventory } from '../inventory/useInventory';
import {
  getCountByCategory,
  getExpired,
  getExpiringSoon,
  getLowStock,
  getTotalValue,
} from '../alerts/alertUtils';
import { formatNaira } from '../../lib/currency';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: 'expired' | 'expiring-soon' | 'low-stock';
}

const ACCENT_STYLES = {
  expired: 'bg-red-50 text-red-600',
  'expiring-soon': 'bg-orange-50 text-orange-600',
  'low-stock': 'bg-amber-50 text-amber-700',
} as const;

function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-500">{label}</span>
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            accent ? ACCENT_STYLES[accent] : 'bg-zinc-100 text-zinc-700',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
        {value}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { medicines } = useInventory();

  const stats = useMemo(() => {
    return {
      total: medicines.length,
      value: getTotalValue(medicines),
      expired: getExpired(medicines).length,
      expiringSoon: getExpiringSoon(medicines).length,
      lowStock: getLowStock(medicines).length,
    };
  }, [medicines]);

  const categoryData = useMemo(
    () => getCountByCategory(medicines),
    [medicines],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Inventory overview and alerts at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total medicines" value={String(stats.total)} icon={Package} />
        <StatCard
          label="Inventory value"
          value={formatNaira(stats.value)}
          icon={Wallet}
        />
        <StatCard
          label="Expired"
          value={String(stats.expired)}
          icon={AlertOctagon}
          accent="expired"
        />
        <StatCard
          label="Expiring soon"
          value={String(stats.expiringSoon)}
          icon={Clock}
          accent="expiring-soon"
        />
        <StatCard
          label="Low stock"
          value={String(stats.lowStock)}
          icon={PackageMinus}
          accent="low-stock"
        />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-zinc-900">
            Medicines by category
          </h2>
          <p className="text-sm text-zinc-500">
            Distribution of your current inventory.
          </p>
        </div>
        <div className="h-72 w-full">
          {categoryData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              No medicines yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#e4e4e7" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e4e4e7' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e4e4e7' }}
                />
                <Tooltip
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e4e4e7',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
