export function AccountNav() {
  return (
    <nav className="space-y-2">
      <a href="/account" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a>
      <a href="/account/orders" className="block p-2 hover:bg-gray-100 rounded">Orders</a>
      <a href="/account/settings" className="block p-2 hover:bg-gray-100 rounded">Settings</a>
    </nav>
  );
}
