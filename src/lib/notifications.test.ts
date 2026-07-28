import { describe, expect, it } from "vitest";
import { buildPalletTransitionNotification } from "./notifications";

describe("buildPalletTransitionNotification", () => {
  it("creates a generic notification for normal status changes", () => {
    expect(
      buildPalletTransitionNotification({
        palletNumber: "PT-001",
        actorName: "Admin User",
        transitionTo: "in_transit",
        palletId: "pallet-1",
      })
    ).toEqual({
      type: "system",
      title: "Pallet In Transit",
      message: "Pallet PT-001 moved to in transit after Admin User's update.",
      link: "/admin/pallets/pallet-1",
    });
  });

  it("creates a special notification for damaged pallets", () => {
    expect(
      buildPalletTransitionNotification({
        palletNumber: "PT-002",
        actorName: "Manager",
        transitionTo: "damaged",
        palletId: "pallet-2",
      })
    ).toEqual({
      type: "damaged_pallet",
      title: "Pallet Damaged",
      message: "Pallet PT-002 has been flagged as damaged and requires inspection.",
      link: "/admin/pallets/pallet-2",
    });
  });
});
