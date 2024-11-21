"use client";
import { useTransitConfig } from "@/hooks/useTransitConfig";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import { H1 } from "@/components/shared/headers";

export default function CatchTheBus() {
    const router = useRouter();
    const { transitConfig, isLoading } = useTransitConfig();

    useEffect(() => {
        if (!isLoading && transitConfig === null) {
            console.log("transitConfig:", transitConfig);
            router.push('/transit-config');
        }
    }, [transitConfig, isLoading, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <div>
        <H1 className="text-center">Catch The Bus</H1>
        <Button className="w-full">I&apos;m Ready to Leave!</Button>
        <div className="overflow-x-auto">
            <pre className="whitespace-pre">
                Transit Config: {JSON.stringify(transitConfig, null, 2)}
            </pre>
        </div>
    </div>;
}
