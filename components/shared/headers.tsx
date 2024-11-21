const H1 = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return <h1 className={`text-h3 sm:text-h1 font-bold ${className}`}>{children}</h1>
}

export { H1 };