"use client";
import { H2 } from "../shared/headers";
import WalkingTimeInput from "./walkingTimeInput";

export default function SetWalkingTime() {
    return (
        <div className="space-y-2">
            <H2>1. Set Walking Time</H2>
            <WalkingTimeInput />
        </div>
    );
}