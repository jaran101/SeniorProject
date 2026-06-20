import { color } from "framer-motion";

export default function bu({ label, color }) {
    return <button style={{background:color}}>{label}</button>;
}