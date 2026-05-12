interface StatusBadgeProps {
  status: string | null;
  approved?: boolean | null;
}

export default function StatusBadge({ status, approved }: StatusBadgeProps) {
  const normalizedStatus = (status ?? "").trim().toLowerCase();
  const isApproved =
    typeof approved === "boolean"
      ? approved
      : ["approved", "approve", "ok", "accepted", "done"].includes(normalizedStatus);

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
        isApproved
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {isApproved ? "Approved" : "Requires Revision"}
    </span>
  );
}
