import GuestGuard from "@/components/GuestGuard";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <GuestGuard>
            {children}
        </GuestGuard>
    );
}
