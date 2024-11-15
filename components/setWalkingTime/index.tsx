"use client";
import { H1 } from "../shared/headers";
import WalkingTimeInput from "./walkingTimeInput";

export default function SetWalkingTime() {
    return (
        <div className="space-y-2">
            <H1>1. Set Walking Time</H1>
            <WalkingTimeInput />
        </div>
    );
}