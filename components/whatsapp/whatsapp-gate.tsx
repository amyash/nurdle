"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { checkinBeaches } from "@/data/checkin-beaches";
import {
  decodeWhatsappLink,
  whatsappLinkKeyForBeach,
  type WhatsappLinkKey,
} from "@/lib/whatsapp-gate/links";
import {
  hasPassedWhatsappGate,
  markWhatsappGatePassed,
} from "@/lib/whatsapp-gate/session";
import {
  validateWhatsappGateSubmission,
  WHATSAPP_CLEARING_QUESTION,
  WHATSAPP_REFERRAL_QUESTION,
} from "@/lib/whatsapp-gate/validate";
import { cn } from "@/lib/cn";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FieldError, FormField, Select } from "@/components/ui/form-field";

type GateRequest = {
  linkKey: WhatsappLinkKey;
  beachId: string;
  label: string;
};

type WhatsAppGateContextValue = {
  openGate: (request: GateRequest) => void;
};

const WhatsAppGateContext = createContext<WhatsAppGateContextValue | null>(null);

function openWhatsappInvite(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-control border px-3 py-2.5 text-sm text-ink transition-colors",
        checked ? "border-mark bg-board" : "border-line bg-white",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function WhatsAppGateModal({
  request,
  open,
  onClose,
}: {
  request: GateRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const openedAtRef = useRef<number>(0);
  const titleId = useId();
  const beachId = useId();
  const honeypotId = useId();
  const errorId = useId();
  const [clearing, setClearing] = useState("");
  const [selectedBeachId, setSelectedBeachId] = useState("");
  const [referral, setReferral] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      openedAtRef.current = Date.now();
      setClearing("");
      setReferral("");
      setSelectedBeachId(request?.beachId ?? "");
      setError(null);
      setBusy(false);
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request || busy) return;

    const form = formRef.current;
    const honeypot =
      (form?.elements.namedItem("company") as HTMLInputElement | null)?.value ??
      "";

    const result = validateWhatsappGateSubmission(
      {
        clearing,
        beachId: selectedBeachId,
        referral,
        honeypot,
      },
      openedAtRef.current,
    );

    if (!result.ok) {
      if (result.reason === "human-check") {
        setError("Please check your answers and try again.");
        return;
      }
      onClose();
      return;
    }

    setBusy(true);
    markWhatsappGatePassed();
    openWhatsappInvite(decodeWhatsappLink(request.linkKey));
    setBusy(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Join WhatsApp"
      titleId={titleId}
      showClose
      size="md"
    >
      <p className="text-sm leading-snug text-mute">
        Quick check before we open the {request?.label ?? "beach"} WhatsApp
        group.
      </p>

      <form ref={formRef} className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <input
          id={honeypotId}
          tabIndex={-1}
          autoComplete="off"
          name="company"
          aria-hidden="true"
          className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <FormField label={WHATSAPP_CLEARING_QUESTION.label}>
          <div className="mt-2 space-y-2">
            {WHATSAPP_CLEARING_QUESTION.options.map((option) => (
              <RadioOption
                key={option.value}
                name="clearing"
                value={option.value}
                label={option.label}
                checked={clearing === option.value}
                onChange={setClearing}
              />
            ))}
          </div>
        </FormField>

        <FormField label="Which beach are you nearest?" htmlFor={beachId}>
          <Select
            id={beachId}
            required
            value={selectedBeachId}
            onChange={(event) => setSelectedBeachId(event.target.value)}
          >
            <option value="" disabled>
              Select a beach
            </option>
            {checkinBeaches.map((beach) => (
              <option key={beach.id} value={beach.id}>
                {beach.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={WHATSAPP_REFERRAL_QUESTION.label}>
          <div className="mt-2 space-y-2">
            {WHATSAPP_REFERRAL_QUESTION.options.map((option) => (
              <RadioOption
                key={option.value}
                name="referral"
                value={option.value}
                label={option.label}
                checked={referral === option.value}
                onChange={setReferral}
              />
            ))}
          </div>
        </FormField>

        <FieldError id={errorId}>{error}</FieldError>

        <Button type="submit" fullWidth disabled={busy}>
          Continue to WhatsApp
        </Button>
      </form>
    </Modal>
  );
}

export function WhatsAppGateProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<GateRequest | null>(null);

  const openGate = useCallback((next: GateRequest) => {
    if (hasPassedWhatsappGate()) {
      openWhatsappInvite(decodeWhatsappLink(next.linkKey));
      return;
    }
    setRequest(next);
  }, []);

  return (
    <WhatsAppGateContext.Provider value={{ openGate }}>
      {children}
      <WhatsAppGateModal
        request={request}
        open={request != null}
        onClose={() => setRequest(null)}
      />
    </WhatsAppGateContext.Provider>
  );
}

export function useWhatsAppGate() {
  const context = useContext(WhatsAppGateContext);
  if (!context) {
    throw new Error("useWhatsAppGate must be used within WhatsAppGateProvider");
  }
  return context;
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

export function WhatsAppAccessButton({
  beachId,
  label,
  className,
  iconClassName = "h-6 w-6 fill-current",
}: {
  beachId: string;
  label: string;
  className?: string;
  iconClassName?: string;
}) {
  const { openGate } = useWhatsAppGate();
  const linkKey = whatsappLinkKeyForBeach(beachId);

  return (
    <button
      type="button"
      aria-label={`Join ${label} WhatsApp group`}
      className={className}
      onClick={() =>
        openGate({
          linkKey,
          beachId,
          label,
        })
      }
    >
      <WhatsAppIcon className={iconClassName} />
    </button>
  );
}

export function WhatsAppCommunityAccessButton({
  className,
  iconClassName = "h-5 w-5 fill-current",
  ariaLabel = "Join WhatsApp",
  label,
  onNavigate,
  iconPosition = "start",
}: {
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
  label?: string;
  onNavigate?: () => void;
  iconPosition?: "start" | "end";
}) {
  const { openGate } = useWhatsAppGate();
  const icon = <WhatsAppIcon className={iconClassName} />;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        onNavigate?.();
        openGate({
          linkKey: "__community__",
          beachId: "",
          label: "community",
        });
      }}
    >
      {label ? (
        <>
          {iconPosition === "start" ? icon : null}
          <span>{label}</span>
          {iconPosition === "end" ? icon : null}
        </>
      ) : (
        icon
      )}
    </button>
  );
}
