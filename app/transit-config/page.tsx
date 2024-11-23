import { H1 } from "@/components/shared/headers";
import TransitConfigForm from "@/components/TransitConfigForm";

export default function App() {
    return (
        <main className="p-4 w-[90vw] sm:w-[400px] mx-auto space-y-4 sm:space-y-8">
            <H1 className="text-center">Select Your Bus Stops & Services</H1>
            <TransitConfigForm />
        </main>
    );
}
