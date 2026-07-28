export type NotificationDraft = {
  palletNumber: string;
  actorName: string;
  transitionTo: string;
  palletId: string;
};

export function buildPalletTransitionNotification({
  palletNumber,
  actorName,
  transitionTo,
  palletId,
}: NotificationDraft) {
  const normalizedStatus = transitionTo.replace(/_/g, " ");
  const title = `Pallet ${normalizedStatus.replace(/\b\w/g, (char) => char.toUpperCase())}`;

  if (transitionTo === "damaged") {
    return {
      type: "damaged_pallet" as const,
      title: "Pallet Damaged",
      message: `Pallet ${palletNumber} has been flagged as damaged and requires inspection.`,
      link: `/admin/pallets/${palletId}`,
    };
  }

  if (transitionTo === "lost") {
    return {
      type: "system" as const,
      title: "Pallet Marked Lost",
      message: `Pallet ${palletNumber} has been marked as lost by ${actorName}.`,
      link: `/admin/pallets/${palletId}`,
    };
  }

  if (transitionTo === "retired") {
    return {
      type: "system" as const,
      title: "Pallet Retired",
      message: `Pallet ${palletNumber} has been permanently retired from circulation.`,
      link: `/admin/pallets/${palletId}`,
    };
  }

  return {
    type: "system" as const,
    title,
    message: `Pallet ${palletNumber} moved to ${normalizedStatus} after ${actorName}'s update.`,
    link: `/admin/pallets/${palletId}`,
  };
}
