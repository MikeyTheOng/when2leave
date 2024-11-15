export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <main className="w-full h-screen flex flex-col items-center">{children}</main>;
}
