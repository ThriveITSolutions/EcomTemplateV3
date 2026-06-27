import { Header } from '@/components/store/header/Header';
import { Footer } from '@/components/store/footer/Footer';
import { ToastProvider } from '@/hooks/useToast';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header cartItemCount={0} wishlistCount={0} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export async function generateMetadata() {
  return {
    title: {
      default: 'Fashion Store',
      template: '%s | Fashion Store',
    },
    description: 'Discover the latest trends in fashion. Shop premium clothing, accessories, and more.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Fashion Store',
    },
  };
}