import { FORM_GATE_HONEYPOT_FIELD } from "@/lib/form-gate/constants";

export function FormGateHoneypotField({ id }: { id: string }) {
  return (
    <input
      id={id}
      tabIndex={-1}
      autoComplete="off"
      name={FORM_GATE_HONEYPOT_FIELD}
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );
}
