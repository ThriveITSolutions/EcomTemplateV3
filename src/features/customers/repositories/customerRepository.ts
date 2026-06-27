import { prisma } from '@/lib/prisma';
import { Prisma, Customer } from '@prisma/client';
import { CreateCustomer, UpdateCustomer, AddressData } from '@/lib/validation/schemas';

export interface CustomerWithRelations extends Customer {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    avatar: string | null;
  };
  addresses: Array<{
    id: string;
    type: string;
    isDefault: boolean;
    firstName: string;
    lastName: string;
    company: string | null;
    address1: string;
    address2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
    phone: string;
  }>;
  _count?: {
    orders: number;
    reviews: number;
    wishlistItems: number;
  };
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date | null;
  wishlistCount: number;
  reviewCount: number;
}

class CustomerRepository {
  // Find customer by ID with relations
  async findById(id: string): Promise<CustomerWithRelations | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlistItems: true,
          },
        },
      },
    }) as Promise<CustomerWithRelations | null>;
  }

  // Find customer by user ID
  async findByUserId(userId: string): Promise<CustomerWithRelations | null> {
    return prisma.customer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          },
        },
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
    }) as Promise<CustomerWithRelations | null>;
  }

  // Create customer with user
  async create(data: CreateCustomer & { userId: string }): Promise<Customer> {
    return prisma.customer.create({
      data: {
        userId: data.userId,
        dateOfBirth: (data as any).dateOfBirth ? new Date((data as any).dateOfBirth) : undefined,
        gender: (data as any).gender,
      },
    });
  }

  // Update customer
  async update(id: string, data: UpdateCustomer): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: {
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        newsletterSubscribed: data.newsletterSubscribed,
        smsSubscribed: data.smsSubscribed,
        marketingConsent: data.marketingConsent,
      },
    });
  }

  // Get customer statistics
  async getStats(customerId: string): Promise<CustomerStats> {
    const [orderStats, wishlistCount, reviewCount] = await Promise.all([
      prisma.order.aggregate({
        where: { customerId },
        _count: true,
        _sum: { totalAmount: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      }),
      prisma.wishlistItem.count({ where: { customerId } }),
      prisma.review.count({ where: { customerId } }),
    ]);

    return {
      totalOrders: orderStats._count,
      totalSpent: orderStats._sum.totalAmount?.toNumber() || 0,
      averageOrderValue: orderStats._count > 0 
        ? (orderStats._sum.totalAmount?.toNumber() || 0) / orderStats._count 
        : 0,
      lastOrderDate: orderStats._count > 0 ? new Date() : null,
      wishlistCount,
      reviewCount,
    };
  }

  // Address management
  async addAddress(customerId: string, data: AddressData): Promise<import('@prisma/client').Address> {
    // If this is set as default, unset other defaults first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { customerId, type: data.type },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        customerId,
        type: data.type,
        isDefault: data.isDefault,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
      },
    });
  }

  async updateAddress(addressId: string, data: AddressData): Promise<import('@prisma/client').Address> {
    // If this is set as default, unset other defaults first
    if (data.isDefault) {
      const address = await prisma.address.findUnique({ where: { id: addressId } });
      if (address) {
        await prisma.address.updateMany({
          where: { customerId: address.customerId, type: data.type, id: { not: addressId } },
          data: { isDefault: false },
        });
      }
    }

    return prisma.address.update({
      where: { id: addressId },
      data: {
        type: data.type,
        isDefault: data.isDefault,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
      },
    });
  }

  async deleteAddress(addressId: string): Promise<void> {
    await prisma.address.delete({ where: { id: addressId } });
  }

  async setDefaultAddress(customerId: string, addressId: string, type: 'shipping' | 'billing'): Promise<void> {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { customerId, type },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);
  }

  // List all customers (for admin)
  async findAll(options: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ customers: CustomerWithRelations[]; total: number }> {
    const { search, page, limit } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = search
      ? {
          OR: [
            { user: { email: { contains: search, mode: 'insensitive' } } },
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
            { user: { phone: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              avatar: true,
            },
          },
          addresses: {
            take: 1,
            orderBy: { isDefault: 'desc' },
          },
          _count: {
            select: {
              orders: true,
              reviews: true,
              wishlistItems: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }) as Promise<CustomerWithRelations[]>,
      prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }
}

export const customerRepository = new CustomerRepository();