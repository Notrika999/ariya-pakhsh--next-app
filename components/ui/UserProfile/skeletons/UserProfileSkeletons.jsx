function Pulse({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white px-3 py-2 drop-shadow-lg dark:border dark:border-gray-700 dark:bg-custom-dark ${className}`}
    >
      {children}
    </div>
  );
}

function times(count) {
  return Array.from({ length: count }, (_, index) => index);
}

export function PageHeaderSkeleton({
  withStat = true,
  withButton = false,
  extraStats = 0,
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Pulse className="h-7 w-44" />
          <Pulse className="mt-2 h-4 w-64 max-w-full" />
        </div>
        <div className="flex items-center gap-4">
          {withButton ? <Pulse className="h-12 w-40 rounded-lg" /> : null}
          {times(extraStats).map((index) => (
            <div key={`extra-stat-${index}`} className="space-y-2 text-right">
              <Pulse className="ms-auto h-3 w-24" />
              <Pulse className="ms-auto h-6 w-16" />
            </div>
          ))}
          {withStat ? (
            <div className="flex items-center gap-3">
              <div className="space-y-2 text-right">
                <Pulse className="ms-auto h-3 w-24" />
                <Pulse className="ms-auto h-6 w-20" />
              </div>
              <Pulse className="size-12 rounded-full" />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function TabsSkeleton({ count = 2 }) {
  return (
    <div className="flex gap-4 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
      {times(count).map((index) => (
        <Pulse key={`tab-${index}`} className="mb-2 h-8 w-28 shrink-0" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <Card>
        <div className="flex items-center justify-between gap-4 md:hidden">
          <Pulse className="size-10 rounded-xl" />
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <div className="space-y-2">
              <Pulse className="ms-auto h-4 w-28" />
              <Pulse className="ms-auto h-3 w-24" />
            </div>
            <Pulse className="size-16 rounded-full" />
          </div>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            <div>
              <Pulse className="h-7 w-32" />
              <Pulse className="mt-2 h-4 w-72 max-w-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-2 text-right">
                <Pulse className="ms-auto h-3 w-24" />
                <Pulse className="ms-auto h-6 w-28" />
              </div>
              <Pulse className="size-12 rounded-full" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {times(4).map((index) => (
          <Card key={`dash-stat-${index}`} className="relative p-3">
            <Pulse className="absolute left-1.5 top-1.5 size-6 rounded-full" />
            <Pulse className="h-3 w-24" />
            <Pulse className="mt-3 h-5 w-16" />
            <Pulse className="mt-3 ms-auto h-3 w-16" />
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl px-3 py-3">
        <div className="mb-3 flex items-center justify-between">
          <Pulse className="h-6 w-28" />
          <Pulse className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          {times(3).map((index) => (
            <Pulse
              key={`dash-order-${index}`}
              className="h-16 rounded-xl bg-gray-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <Pulse className="mb-4 h-6 w-32" />
          <div className="space-y-4">
            {times(4).map((index) => (
              <div key={`dash-activity-${index}`} className="flex gap-3">
                <Pulse className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-36" />
                  <Pulse className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Pulse className="mb-4 h-6 w-44" />
          <div className="space-y-4">
            {times(3).map((index) => (
              <Pulse
                key={`dash-offer-${index}`}
                className="h-24 rounded-lg bg-gray-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function OrdersPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <Card className="space-y-5 p-3">
        <div className="flex items-center justify-between gap-4">
          <Pulse className="h-5 w-32" />
          <Pulse className="hidden h-10 w-64 rounded-lg md:block" />
        </div>
        <div className="flex items-end gap-6 border-b border-gray-200 pb-3 dark:border-gray-700">
          {times(4).map((index) => (
            <Pulse key={`order-tab-${index}`} className="h-5 w-20" />
          ))}
        </div>
      </Card>
      <Card>
        <OrdersListSkeleton />
      </Card>
    </div>
  );
}

export function OrdersListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 py-4">
        {times(count).map((index) => (
          <div
            key={`order-card-${index}`}
            className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-4 px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <Pulse className="h-4 w-24" />
                <Pulse className="size-5 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Pulse className="h-3 w-28" />
                <Pulse className="h-3 w-32" />
                <Pulse className="h-3 w-24" />
              </div>
              <div className="flex gap-2">
                {times(4).map((thumb) => (
                  <Pulse
                    key={`order-thumb-${index}-${thumb}`}
                    className="size-14 rounded-lg"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Pulse className="h-9 w-24 rounded-lg" />
                <Pulse className="h-9 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <div className="space-y-2 lg:col-span-3">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Pulse className="h-7 w-52" />
            <Pulse className="mt-2 h-4 w-40" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Pulse className="h-8 w-20 rounded-lg" />
            <Pulse className="h-7 w-24 rounded-full" />
            <Pulse className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </Card>

      <Card>
        <Pulse className="mb-4 h-6 w-24" />
        <div className="flex items-start justify-between gap-3 overflow-x-auto pt-2">
          {times(4).map((index) => (
            <div
              key={`order-step-${index}`}
              className="flex w-36 shrink-0 flex-col items-center sm:w-auto sm:flex-1"
            >
              <Pulse className="size-12 rounded-full" />
              <Pulse className="mt-3 h-4 w-16" />
              <Pulse className="mt-2 h-3 w-20" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <Card>
            <Pulse className="mb-4 h-6 w-32" />
            <div className="space-y-3">
              {times(3).map((index) => (
                <div
                  key={`order-item-${index}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 p-3 dark:border-gray-700"
                >
                  <Pulse className="size-20 shrink-0 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Pulse className="h-4 w-3/4" />
                    <Pulse className="h-3 w-1/2" />
                    <Pulse className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-2">
          <Card className="p-4">
            <Pulse className="mb-4 h-6 w-28" />
            <div className="space-y-3">
              {times(4).map((index) => (
                <div
                  key={`order-summary-${index}`}
                  className="flex items-center justify-between"
                >
                  <Pulse className="h-3 w-20" />
                  <Pulse className="h-3 w-24" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <Pulse className="mb-4 h-6 w-24" />
            <Pulse className="h-16 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TicketsPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton withStat={false} withButton />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        {times(4).map((index) => (
          <Card key={`ticket-stat-${index}`} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Pulse className="h-3 w-20" />
                <Pulse className="h-6 w-10" />
              </div>
              <Pulse className="size-12 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Pulse className="h-10 w-full rounded-lg sm:w-44" />
          <Pulse className="h-10 w-full rounded-lg sm:w-44" />
          <Pulse className="h-10 w-full rounded-lg sm:w-44" />
        </div>
      </Card>
      <Card className="rounded-3xl p-3">
        <Pulse className="mb-6 h-6 w-32" />
        <TicketsTableSkeleton />
      </Card>
    </div>
  );
}

export function TicketsTableSkeleton({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
      <div className="h-12 bg-gray-100 dark:bg-gray-800/60" />
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {times(rows).map((index) => (
          <div
            key={`ticket-row-${index}`}
            className="grid grid-cols-3 gap-3 px-5 py-4 md:grid-cols-7"
          >
            <Pulse className="h-4 w-16" />
            <Pulse className="col-span-2 h-4 w-full" />
            <Pulse className="hidden h-4 w-16 md:block" />
            <Pulse className="hidden h-4 w-14 md:block" />
            <Pulse className="hidden h-4 w-16 md:block" />
            <Pulse className="hidden h-4 w-20 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TicketDetailsSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Pulse className="h-7 w-48" />
            <Pulse className="mt-2 h-4 w-56" />
          </div>
          <div className="flex gap-3">
            <Pulse className="h-7 w-20 rounded-full" />
            <Pulse className="h-9 w-40 rounded-lg" />
          </div>
        </div>
      </Card>
      <Card>
        <Pulse className="mb-4 h-6 w-24" />
        <div className="flex items-start justify-between gap-3 overflow-x-auto pt-2">
          {times(3).map((index) => (
            <div
              key={`ticket-step-${index}`}
              className="flex w-40 shrink-0 flex-col items-center sm:w-auto sm:flex-1"
            >
              <Pulse className="size-12 rounded-full" />
              <Pulse className="mt-3 h-4 w-20" />
              <Pulse className="mt-2 h-3 w-16" />
            </div>
          ))}
        </div>
      </Card>
      <Card className="min-h-72 p-4">
        <div className="space-y-4">
          {times(3).map((index) => (
            <div
              key={`ticket-msg-${index}`}
              className={`flex ${index % 2 ? "justify-start" : "justify-end"}`}
            >
              <div className="w-full max-w-md space-y-2 rounded-2xl border border-gray-100 p-4 dark:border-gray-700">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-4 w-full" />
                <Pulse className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <Pulse className="h-24 w-full rounded-xl" />
        <Pulse className="mt-3 h-10 w-32 rounded-lg" />
      </Card>
    </div>
  );
}

export function CommentsPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton extraStats={1} />
      <TabsSkeleton />
      <CommentsListSkeleton />
    </div>
  );
}

export function CommentsListSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
      {times(count).map((index) => (
        <Card key={`comment-${index}`}>
          <div className="flex gap-4">
            <Pulse className="size-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <Pulse className="h-4 w-40" />
                <Pulse className="h-6 w-16 rounded-full" />
              </div>
              <Pulse className="h-3 w-24" />
              <Pulse className="h-3 w-28" />
              <Pulse className="h-12 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function DiscountPointsSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <TabsSkeleton />
      <DiscountCodesSkeleton />
    </div>
  );
}

export function DiscountCodesSkeleton() {
  return (
    <div className="space-y-2">
      {times(3).map((section) => (
        <Card key={`coupon-section-${section}`}>
          <Pulse className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {times(3).map((index) => (
              <Pulse
                key={`coupon-${section}-${index}`}
                className="h-40 rounded-2xl bg-gray-100 dark:bg-zinc-800"
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FavoritesPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Pulse className="h-10 w-full rounded-lg sm:w-44" />
          <Pulse className="h-10 w-full rounded-lg sm:flex-1" />
        </div>
      </Card>
      <Card>
        <Pulse className="mb-4 h-6 w-44" />
        <FavoritesGridSkeleton />
      </Card>
    </div>
  );
}

export function FavoritesGridSkeleton({ count = 6 }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {times(count).map((index) => (
        <div key={`fav-${index}`} className="space-y-3">
          <Pulse className="h-44 rounded-xl" />
          <Pulse className="h-4 w-3/4" />
          <Pulse className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function ActivityHistoryPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <TabsSkeleton />
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <Pulse className="h-6 w-36" />
          <Pulse className="h-9 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {times(6).map((index) => (
            <Pulse
              key={`visit-${index}`}
              className="h-48 rounded-2xl bg-gray-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ChangePasswordPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton withStat={false} />
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <Pulse className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Pulse className="h-5 w-40" />
            {times(4).map((index) => (
              <Pulse key={`tip-${index}`} className="h-3 w-full max-w-md" />
            ))}
          </div>
        </div>
      </div>
      <Card>
        <Pulse className="mb-4 h-6 w-40" />
        <div className="space-y-4">
          {times(3).map((index) => (
            <div key={`password-field-${index}`} className="space-y-2">
              <Pulse className="h-3 w-28" />
              <Pulse className="h-12 w-full rounded-lg" />
            </div>
          ))}
          <Pulse className="h-11 w-40 rounded-lg" />
        </div>
      </Card>
    </div>
  );
}

export function InformationPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <Card className="p-6">
        <Pulse className="mb-6 h-6 w-32" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {times(8).map((index) => (
            <div key={`info-field-${index}`} className="space-y-2">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-12 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Pulse className="mt-6 h-11 w-56 rounded-lg" />
      </Card>
      <Card className="p-6">
        <Pulse className="mb-6 h-6 w-32" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {times(4).map((index) => (
            <div
              key={`security-${index}`}
              className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <Pulse className="h-3 w-20" />
              <Pulse className="h-4 w-32" />
              <Pulse className="h-3 w-24" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function OrdersReturnPageSkeleton() {
  return (
    <div className="space-y-8 lg:col-span-3">
      <PageHeaderSkeleton />
      <Card className="p-6">
        <Pulse className="mb-6 h-6 w-44" />
        <div className="space-y-6">
          <div className="space-y-3">
            <Pulse className="h-4 w-28" />
            {times(3).map((index) => (
              <Pulse
                key={`return-item-${index}`}
                className="h-24 rounded-xl bg-gray-100 dark:bg-zinc-800"
              />
            ))}
          </div>
          <div className="space-y-2">
            <Pulse className="h-4 w-24" />
            <Pulse className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Pulse className="h-4 w-32" />
            <Pulse className="h-24 w-full rounded-xl" />
          </div>
          <Pulse className="h-11 w-40 rounded-lg" />
        </div>
      </Card>
    </div>
  );
}

export function NotificationPageSkeleton() {
  return (
    <div className="space-y-8 lg:col-span-3">
      <PageHeaderSkeleton />
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Pulse className="h-10 w-44 rounded-lg" />
            <Pulse className="h-10 w-44 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Pulse className="h-10 w-32 rounded-lg" />
            <Pulse className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        {times(4).map((index) => (
          <Card key={`notif-${index}`} className="p-4">
            <div className="flex gap-4">
              <Pulse className="size-12 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <Pulse className="h-4 w-40" />
                  <Pulse className="h-5 w-16 rounded-full" />
                </div>
                <Pulse className="h-3 w-full" />
                <Pulse className="h-3 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AddressPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <Card>
        <Pulse className="h-14 w-full rounded-lg" />
      </Card>
      <AddressListSkeleton />
    </div>
  );
}

export function AddressListSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {times(count).map((index) => (
        <Card key={`address-${index}`} className="p-4">
          <div className="mb-4 flex items-start justify-between">
            <Pulse className="h-5 w-28" />
            <div className="flex gap-2">
              <Pulse className="size-5 rounded" />
              <Pulse className="size-5 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <Pulse className="h-3 w-40" />
            <Pulse className="h-3 w-full" />
            <Pulse className="h-3 w-2/3" />
            <Pulse className="h-3 w-32" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function CreditHistoryPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {times(3).map((index) => (
          <Card key={`credit-stat-${index}`} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-7 w-32" />
              </div>
              <Pulse className="size-12 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="flex flex-col gap-3 md:flex-row">
          <Pulse className="h-10 w-full rounded-lg md:w-44" />
          <Pulse className="h-10 w-full rounded-lg md:w-44" />
          <Pulse className="h-10 w-full rounded-lg md:flex-1" />
        </div>
      </Card>
      <Card>
        <Pulse className="mb-6 h-6 w-32" />
        <CreditTransactionsSkeleton />
      </Card>
    </div>
  );
}

export function CreditTransactionsSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {times(count).map((index) => (
        <Pulse
          key={`tx-${index}`}
          className="h-24 rounded-2xl bg-gray-100 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

export function GiftCartPageSkeleton() {
  return (
    <div className="space-y-4 lg:col-span-3">
      <PageHeaderSkeleton />
      <TabsSkeleton count={1} />
      <Card>
        <Pulse className="mb-4 h-6 w-40" />
        <GiftCardsGridSkeleton />
      </Card>
      <Card>
        <Pulse className="mb-4 h-6 w-48" />
        <GiftCardsGridSkeleton count={2} />
      </Card>
    </div>
  );
}

export function GiftCardsGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {times(count).map((index) => (
        <Pulse
          key={`gift-${index}`}
          className="h-72 rounded-2xl bg-gray-100 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}
