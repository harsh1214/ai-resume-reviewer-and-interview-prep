import AuthGuard from "@/components/AuthGuard";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}
