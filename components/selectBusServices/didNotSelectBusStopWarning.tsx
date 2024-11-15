import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/shadcn/alert"
import { AlertCircle } from "lucide-react"

export default function DidNotSelectBusStopWarning() {
    return (
        <Alert variant="secondary">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Choose a bus stop first</AlertTitle>
            <AlertDescription>
                Please select a bus stop first.
            </AlertDescription>
        </Alert>
    )
}
