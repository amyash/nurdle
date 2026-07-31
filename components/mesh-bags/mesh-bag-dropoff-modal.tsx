"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  MESH_BAG_DROPOFF_NAME_MAX,
  MESH_BAG_DROPOFF_OTHER_MAX,
  MESH_BAG_DROPOFF_QUANTITY_MAX,
  localDateTimeInputValue,
  londonLocalInputToIso,
  meshBagDropoffLocations,
} from "@/lib/mesh-bags/dropoff-format";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FormField,
  Input,
  Select,
} from "@/components/ui/form-field";

export function MeshBagDropoffModal({
  open,
  busy,
  error,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: {
    quantity: number;
    locationId: string;
    locationLabel: string;
    locationOther: string | null;
    droppedAt: string;
    makerName: string | null;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const quantityId = useId();
  const locationId = useId();
  const otherId = useId();
  const timeId = useId();
  const nameId = useId();
  const nameHelpId = useId();
  const errorId = useId();
  const [localError, setLocalError] = useState<string | null>(null);
  const [locationValue, setLocationValue] = useState("");
  const locations = meshBagDropoffLocations();

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setLocalError(null);
      setLocationValue("");
    }
  }

  useEffect(() => {
    if (!open) return;
    formRef.current?.reset();
    const quantity = formRef.current?.elements.namedItem(
      "quantity",
    ) as HTMLInputElement | null;
    if (quantity) quantity.value = "1";
    const droppedAt = formRef.current?.elements.namedItem(
      "droppedAt",
    ) as HTMLInputElement | null;
    if (droppedAt) droppedAt.value = localDateTimeInputValue();
    formRef.current?.closest("dialog")?.scrollTo({ top: 0 });
  }, [open]);

  const displayError = localError ?? error;
  const showOther = locationValue === "other";

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={busy}
      title="Log a bag drop-off"
      titleId={titleId}
      showClose
      tabIndex={-1}
    >
      <form
        ref={formRef}
        className="min-w-0"
        onSubmit={(event) => {
          event.preventDefault();
          if (busy) return;
          setLocalError(null);
          const data = new FormData(event.currentTarget);
          const quantity = Number(data.get("quantity"));
          const selectedId = String(data.get("locationId") ?? "");
          const otherRaw = String(data.get("locationOther") ?? "").trim();
          const droppedRaw = String(data.get("droppedAt") ?? "");
          const nameRaw = String(data.get("makerName") ?? "").trim();

          if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > MESH_BAG_DROPOFF_QUANTITY_MAX
          ) {
            setLocalError("Enter how many bags you dropped off (1–500).");
            return;
          }

          const selected = locations.find((item) => item.id === selectedId);
          if (!selected) {
            setLocalError("Choose where the bags were dropped off.");
            return;
          }

          if (selectedId === "other" && !otherRaw) {
            setLocalError("Enter the other location.");
            return;
          }
          if (otherRaw.length > MESH_BAG_DROPOFF_OTHER_MAX) {
            setLocalError(
              "Other location needs to be 80 characters or fewer.",
            );
            return;
          }

          const droppedAt = londonLocalInputToIso(droppedRaw);
          if (!droppedAt) {
            setLocalError("Choose when the bags were dropped off.");
            return;
          }

          if (nameRaw.length > MESH_BAG_DROPOFF_NAME_MAX) {
            setLocalError("Names need to be 40 characters or fewer.");
            return;
          }

          onSubmit({
            quantity,
            locationId: selectedId,
            locationLabel:
              selectedId === "other" ? otherRaw : selected.label,
            locationOther: selectedId === "other" ? otherRaw : null,
            droppedAt,
            makerName: nameRaw || null,
          });
        }}
      >
        <p className="text-sm leading-snug text-mute">
          Tell volunteers where bags are available. Entries disappear after 24
          hours.
        </p>

        <FormField label="Number of bags" htmlFor={quantityId} className="mt-4">
          <Input
            id={quantityId}
            name="quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={MESH_BAG_DROPOFF_QUANTITY_MAX}
            step={1}
            required
            defaultValue={1}
            disabled={busy}
            className="min-w-0"
          />
        </FormField>

        <FormField
          label="Drop-off location"
          htmlFor={locationId}
          className="mt-4"
        >
          <Select
            id={locationId}
            name="locationId"
            required
            disabled={busy}
            value={locationValue}
            onChange={(event) => setLocationValue(event.target.value)}
            className="min-w-0"
          >
            <option value="" disabled>
              Choose a location
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </Select>
        </FormField>

        {showOther ? (
          <FormField
            label="Other location"
            htmlFor={otherId}
            className="mt-3"
          >
            <Input
              id={otherId}
              name="locationOther"
              type="text"
              required
              maxLength={MESH_BAG_DROPOFF_OTHER_MAX}
              disabled={busy}
              autoComplete="off"
              className="min-w-0"
              placeholder="Where did you leave the bags?"
            />
          </FormField>
        ) : (
          <input type="hidden" name="locationOther" value="" />
        )}

        <FormField label="Drop-off time" htmlFor={timeId} className="mt-4">
          <Input
            id={timeId}
            name="droppedAt"
            type="datetime-local"
            required
            disabled={busy}
            className="max-w-full min-w-0"
          />
        </FormField>

        <FormField
          label="Your name"
          htmlFor={nameId}
          optional
          className="mt-4"
          description={
            <span id={nameHelpId}>
              Not shown publicly unless we decide to use it later.
            </span>
          }
        >
          <Input
            id={nameId}
            name="makerName"
            type="text"
            maxLength={MESH_BAG_DROPOFF_NAME_MAX}
            disabled={busy}
            autoComplete="given-name"
            aria-describedby={nameHelpId}
            className="min-w-0"
          />
        </FormField>

        <FieldError id={errorId}>{displayError}</FieldError>

        <Button type="submit" fullWidth disabled={busy} className="mt-4">
          {busy ? "Saving…" : "Log drop-off"}
        </Button>
      </form>
    </Modal>
  );
}
