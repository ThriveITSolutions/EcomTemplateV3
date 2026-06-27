import { customerRepository, type CustomerWithRelations, type CustomerStats } from '../repositories/customerRepository';
import { CreateCustomer, UpdateCustomer, AddressData } from '@/lib/validation/schemas';
import { prisma } from '@/lib/prisma';
import type { Customer, Address } from '@prisma/client';

export interface CustomerProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  phone: string | null;
  avatar: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  newsletterSubscribed: boolean;
  smsSubscribed: boolean;
  loyaltyTier: string | null;
  loyaltyPoints: number;
  createdAt: Date;
  addresses: Address[];
  stats: CustomerStats;
}

class CustomerService {
  // Get customer profile
  async getProfile(userId: string): Promise<CustomerProfile | null> {
    const customer = await customerRepository.findByUserId(userId);
    
    if (!customer) return null;

    const stats = await customerRepository.getStats(customer.id);

    return {
      id: customer.id,
      email: customer.user.email,
      firstName: customer.user.firstName,
      lastName: customer.user.lastName,
      fullName: `${customer.user.firstName || ''} ${customer.user.lastName || ''}`.trim(),
      phone: customer.user.phone,
      avatar: customer.user.avatar,
      dateOfBirth: customer.dateOfBirth,
      gender: customer.gender,
      newsletterSubscribed: customer.newsletterSubscribed,
      smsSubscribed: customer.smsSubscribed,
      loyaltyTier: customer.loyaltyTier,
      loyaltyPoints: customer.loyaltyPoints,
      createdAt: customer.createdAt,
      addresses: customer.addresses as Address[],
      stats,
    };
  }

  // Update customer profile
  async updateProfile(userId: string, data: UpdateCustomer): Promise<Customer | null> {
    const customer = await customerRepository.findByUserId(userId);
    
    if (!customer) return null;

    // Update user info if provided
    if (data.firstName || data.lastName || data.phone) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });
    }

    return customerRepository.update(customer.id, data);
  }

  // Get customer by ID (for admin)
  async getById(id: string): Promise<CustomerWithRelations | null> {
    return customerRepository.findById(id);
  }

  // List customers (for admin)
  async list(options: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: CustomerWithRelations[]; total: number; totalPages: number }> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    
    const { customers, total } = await customerRepository.findAll({
      search: options.search,
      page,
      limit,
    });

    return {
      customers,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Address management
  async addAddress(userId: string, data: AddressData): Promise<Address | null> {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) return null;

    return customerRepository.addAddress(customer.id, data);
  }

  async updateAddress(addressId: string, userId: string, data: AddressData): Promise<Address | null> {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) return null;

    // Verify address belongs to customer
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.customerId !== customer.id) return null;

    return customerRepository.updateAddress(addressId, data);
  }

  async deleteAddress(addressId: string, userId: string): Promise<boolean> {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) return false;

    // Verify address belongs to customer
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.customerId !== customer.id) return false;

    await customerRepository.deleteAddress(addressId);
    return true;
  }

  async setDefaultAddress(userId: string, addressId: string, type: 'shipping' | 'billing'): Promise<boolean> {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) return false;

    // Verify address belongs to customer
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.customerId !== customer.id) return false;

    await customerRepository.setDefaultAddress(customer.id, addressId, type);
    return true;
  }

  // Get customer stats
  async getStats(userId: string): Promise<CustomerStats | null> {
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) return null;

    return customerRepository.getStats(customer.id);
  }

  // Create customer (used during user creation)
  async createFromUser(userId: string, data?: Partial<CreateCustomer>): Promise<Customer> {
    return customerRepository.create({
      userId,
      email: '',
      firstName: '',
      lastName: '',
    } as CreateCustomer & { userId: string });
  }
}

export const customerService = new CustomerService();