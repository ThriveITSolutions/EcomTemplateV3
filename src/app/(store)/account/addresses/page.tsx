import { Plus, Pencil, Trash2, MapPin, Check } from 'lucide-react';

// Sample addresses
const addresses = [
  {
    id: '1',
    type: 'shipping',
    isDefault: true,
    firstName: 'Rahim',
    lastName: 'Ahmed',
    address1: '123 Fashion Street',
    address2: 'Apt 4B',
    city: 'Dhaka',
    state: 'Dhaka',
    postalCode: '1000',
    country: 'Bangladesh',
    phone: '+880 1712345678',
  },
  {
    id: '2',
    type: 'billing',
    isDefault: true,
    firstName: 'Rahim',
    lastName: 'Ahmed',
    address1: '456 Commerce Avenue',
    address2: 'Floor 2',
    city: 'Dhaka',
    state: 'Dhaka',
    postalCode: '1001',
    country: 'Bangladesh',
    phone: '+880 1712345678',
  },
];

export const metadata = {
  title: 'My Addresses',
  description: 'Manage your addresses',
};

export default function AddressesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium">My Addresses</h1>
          <p className="text-sm text-gray-500">Manage your shipping and billing addresses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Addresses */}
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Addresses
          </h2>
          <div className="space-y-4">
            {addresses.filter(a => a.type === 'shipping').map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Shipping</span>
                    {address.isDefault && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-medium">{address.firstName} {address.lastName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {address.address1}
                  {address.address2 && <>, {address.address2}</>}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.postalCode}
                </p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Addresses */}
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Billing Addresses
          </h2>
          <div className="space-y-4">
            {addresses.filter(a => a.type === 'billing').map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Billing</span>
                    {address.isDefault && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-medium">{address.firstName} {address.lastName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {address.address1}
                  {address.address2 && <>, {address.address2}</>}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.postalCode}
                </p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}