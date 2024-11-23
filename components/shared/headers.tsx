const H1 = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return <h1 className={`text-h2 sm:text-h1 font-bold ${className}`}>{children}</h1>
}

const H2 = ({ className, children }: { className?: string, children: React.ReactNode }) => {
    return <h1 className={`text-h3 sm:text-h2 font-bold ${className}`}>{children}</h1>
}

export { H1, H2 };